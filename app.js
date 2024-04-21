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
const Chat = require('./models/chat')

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
passport.use('customerLocal',new LocalStrategy(Customer.authenticate()))
passport.use('sellerLocal',new LocalStrategy(Seller.authenticate()))
passport.serializeUser(function(user, done) { 
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    if(user!=null)
      done(null,user);
  });

///SELLER PASSPORT CONFIG


///ADDING GLOBAL VARIABLES

app.use((req, res, next) => {
    console.log("SESSION  :",req.session) 
    res.locals.currentUser = req.user;
    if (req.user && req.user.role) {
        // Set a local variable indicating if the user is a customer
        res.locals.customer = req.user.role === 'customer';
        res.locals.seller = req.user.role === 'seller';
    }
    else {
        // If user is not authenticated or role is not defined, set customer to false
        res.locals.customer = false;
        res.locals.seller = false;
    }
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.info = req.flash('info')
    res.locals.cartInfo = req.flash('cartInfo')
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

//CUSTOMER ROUTES

app.use('/customer', customerRoutes);

//SELLER ROUTES

app.use('/seller', sellerRoutes)

/// AUTHENTICATION ROUTE

app.use('/', authRoutes)

///CHAT ROUTES

app.use('/chat', chatRoutes)

app.get('/', (req, res) => {
    res.send('welcome to zen, the ecommerce store developed by one of you!')
})

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
    console.log('Socket connected:', socket.id);

    socket.on('joinRoom', room => {
        socket.join(room);
        console.log(`${socket.id} joined room ${room}`);
        const socketsInRoom = io.sockets.adapter.rooms.get(room);
        console.log(`Sockets in room ${room}:`, socketsInRoom);
    });

    socket.on('sendMessage', async messageData => {
        try {
            // Extract data from messageData
            console.log(messageData);
            const { sellerId, customerId, message } = messageData;
            const timestamp1 = new Date();
    
            // Find or create a new Chat document
            let chat = await Chat.findOne({ seller: sellerId, customer: customerId });
            if (!chat) {
                chat = new Chat({
                    seller: sellerId,
                    customer: customerId,
                    messages: []
                });
            }
    
            // Push the new message data into the messages array of the Chat document
            const newMessage = {
                content: message.content,
                sender: message.sender,
                timestamp: timestamp1
            };
    
            chat.messages.push(newMessage);
    
            // Save the Chat document to MongoDB
            await chat.save();
            console.log('Message saved to MongoDB:', chat);
    
            // Emit the newMessage to all clients
            io.emit('newMessage', newMessage);
        } catch (error) {
            console.error('Error saving message to MongoDB:', error);
        }
    });
    


    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

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


