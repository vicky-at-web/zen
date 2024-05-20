// DECLARATIONS OF VARIABLES

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const path = require('path');
const customerRoutes = require('./routes/customerRoutes');
const sellerRoutes = require('./routes/sellerRoutes')
const authRoutes = require('./routes/authRoutes');
const expErr = require('./utils/expressErr');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Seller = require('./models/seller')
const Customer = require('./models/customer')
const chatRoutes = require('./routes/chatRoutes')
const Chat = require('./models/chat');
const Notification = require('./models/notification')
const Question = require('./models/question');
const { validateReview } = require('./utils/middleware');
const Product = require('./models/product');
const catchAsync = require('./utils/catchasync');
const Review = require('./models/review')

//EJS ENGINE CONNECTIONS

app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

///SESSION CONFIG

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

///PASSPORT CONFIGURATION

app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());

//////CUSTOMER PASSPORT CONFIG

passport.use('customerLocal', new LocalStrategy(Customer.authenticate()))
passport.use('sellerLocal', new LocalStrategy(Seller.authenticate()))
passport.serializeUser(function (customer, done) {
    done(null, customer);
});

passport.deserializeUser(function (user, done) {
    if (user != null)
        done(null, user);
});

///ADDING GLOBAL VARIABLES
app.use((req, res, next) => {
    console.log("SESSION  :", req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.info = req.flash('info')
    res.locals.cartInfo = req.flash('cartInfo')
    if (req.user && req.user.role) {
        res.locals.customer = req.user.role === 'customer';
        res.locals.seller = req.user.role === 'seller';
    }
    else {
        res.locals.customer = false;
        res.locals.seller = false;
    }
    next();
})

//ADDING PUBLIC DIRECTORY

app.use(express.static(path.join(__dirname, 'public')))

//MONGO CONNECTIONS

mongoose.connect('mongodb://127.0.0.1:27017/zen26');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'CONNECTION FAILED!'));
db.once('open', () => {
    console.log('DATABASE CONNECTED');
})

/// AUTHENTICATION ROUTE

app.use('/', authRoutes)

//CUSTOMER ROUTES

app.use('/customer', customerRoutes);

//SELLER ROUTES

app.use('/seller', sellerRoutes)

///CHAT ROUTES

app.use('/chat', chatRoutes)

///FIRST ROUTE OF ZEN

app.get('/', (req, res) => {
    res.send('welcome to zen, the ecommerce store developed by one of you!')
})

///SOCKET.IO CONFIGURATIONS

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const userMap = new Map();

io.on('connection', socket => {
    console.log('Socket connected:', socket.id);

    socket.on('joinRoom', room => {
        socket.join(room);
        console.log(`${socket.id} joined room ${room}`);
        const socketsInRoom = io.sockets.adapter.rooms.get(room);
        console.log(`Sockets in room ${room}:`, socketsInRoom);
    });

    socket.on('join', user => {
        socket.join(user);
        userMap.set(user, socket.id)
        console.log(userMap)
    })


    socket.on('sendMessage', async messageData => {
        try {
            console.log(messageData);
            const { sellerId, customerId, message } = messageData;
            const timestamp1 = new Date();
            let chat = await Chat.findOne({ seller: sellerId, customer: customerId });
            if (!chat) {
                chat = new Chat({
                    seller: sellerId,
                    customer: customerId,
                    messages: []
                });
            }
            const newMessage = {
                content: message.content,
                sender: message.sender,
                timestamp: timestamp1
            };
            chat.messages.push(newMessage);
            await chat.save();
            console.log('Message saved to MongoDB:', chat);
            io.emit('newMessage', newMessage);
        } catch (error) {
            console.error('Error saving message to MongoDB:', error);
        }
    });

    const notifyCustomer = (user, message) => {
        const socketId = userMap.get(user);
        if (socketId) {
            io.to(socketId).emit('notifyCustomer', message);
        }
    };

    const notifySeller = (user, message) => {
        const socketId = userMap.get(user);
        if (socketId) {
            io.to(socketId).emit('notifySeller', message)
        }
    }

    socket.on('disconnect', () => {
        userMap.forEach((value, key) => {
            if (value === socket.id) {
                userMap.delete(key);
            }
        });
        console.log('Socket disconnected:', socket.id);
    });
});

///ROUTES FOR REAL TIME EVENTS AND DATABASE OPERATIONS FOR SELLERS

app.post('/customer/products/:id/queries', catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('seller');
    const currentDate = new Date();
    const question = new Question(req.body.query);
    question.author = req.user._id;
    question.date = currentDate;
    await question.save();
    product.queries.push(question);
    await product.save();
    const notification = new Notification({
        header: `New query From ${req.user.username} from the product ${product.name}`,
        message: `${question.question} ?`,
        timestamp: Date.now(),
        read: false,
        productName: product.name,
        productId: product.id,
        productSeller: product.seller._id

    })
    const seller = await Seller.findById(product.seller.id);
    await notification.save();
    seller.notifications.unshift(notification);
    await seller.save();
    try {
        io.emit('notifySeller', notification)
        console.log('notification has been sent successfully')
    } catch (e) {
        console.log(e)
    }
    req.flash('success', 'The question has been posted Successfully!')
    res.redirect(`/customer/products/${id}`);
}));

app.post('/customer/products/:id/reviews', validateReview, catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        const currentDate = new Date();
        review.date = currentDate;
        product.reviews.push(review);
        await review.save();
        await product.save();
        const notification = new Notification({
            header: `New review From ${req.user.username} `,
            message: `Reviewed the product ${product.name} at ${review.rating} rating with a message ${review.body}`,
            timestamp: Date.now(),
            read: false,
            productName: product.name,
            productId: product.id,
            productSeller: product.seller._id
        })
        const seller = await Seller.findById(product.seller._id);
        await notification.save();
        seller.notifications.unshift(notification);
        await seller.save();
        if (userMap.has(product.seller._id)) {
            notifySeller(product.seller._id, notification)
        }
    } catch (e) {
        console.log(e)
    }
    res.redirect(`/customer/products/${product.id}`)
}));

///ROUTES FOR REAL TIME EVENTS AND DATABASE OPERATIONS FOR SELLERS

app.post('/seller/products/:id/queries/:queryId', catchAsync(async (req, res) => {
    const { id, queryId } = req.params;
    const product = await Product.findById(id);
    const question = await Question.findById(queryId);
    const currentDate = new Date;
    question.answers.push({ answer: req.body.answer, author: { username: req.user.username, profile: req.user.imageUrl }, date: currentDate.getTime(), authorRole: req.user.role });
    await question.save();
    await product.save();
    try {
        const notification = new Notification({
            header: `New reply From ${req.user.username} ~ (${req.user.role})`,
            message: `${req.body.answer}`,
            timestamp: Date.now(),
            read: false,
            productName: product.name,
            productId: product.id,
            productSeller: product.seller._id
        });
        const customer = await Customer.findById(question.author._id);
        await notification.save();
        customer.notifications.unshift(notification);
        await customer.save();
        if (userMap.has(question.author._id)) {
            notifyCustomer(question.author._id, notification)
        }
    } catch (e) {
        console.log(e)
    }
    res.redirect(`/seller/products/${id}`);
}))

app.post('/customer/products/:id/queries/:queryId', catchAsync(async (req, res) => {
    const { id, queryId } = req.params;
    const product = await Product.findById(id);
    const question = await Question.findById(queryId);
    const currentDate = new Date();
    question.answers.push({ answer: req.body.answer, author: { username: req.user.username, profile: req.user.profilePic }, date: currentDate, authorRole: req.user.role });
    await question.save();
    await product.save();
    try {
        const notification = new Notification({
            header: `New reply From ${req.user.username} ~ (${req.user.role})`,
            message: `${req.body.answer}`,
            timestamp: Date.now(),
            read: false,
            productName: product.name,
            productId: product.id,
            productSeller: product.seller._id
        });
        const customer = await Customer.findById(question.author._id);
        await notification.save();
        customer.notifications.unshift(notification);
        await customer.save();
        if (userMap.has(question.author._id)) {
            notifyCustomer(question.author._id, notification)
        }
    } catch (e) {
        console.log(e)
    }
    res.redirect(`/customer/products/${id}`);
}));


// ERROR MIDDLEWARES 

app.all('*', (req, res, next) => {
    next(new expErr('NOT FOUND', 400))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something Went Wrong';
    res.status(statusCode).render('error', { err })
})

//PORT CONFIGURATION

server.listen(3000, () => {
    console.log('LISTENING ON THE PORT 3000')
})
