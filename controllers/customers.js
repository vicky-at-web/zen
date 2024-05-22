const catchAsync = require('../utils/catchasync');
const Product = require('../models/product');
const Review = require('../models/review');
const Question = require('../models/question')
const categories = ['Computers', 'Mobiles', 'Cameras', 'Men"s', 'Women"s', 'Kids', 'Accessories', 'Decor', 'Kitchen', 'Bedding', 'Skincare', 'Haircare', 'Perfumes', 'Books', 'Movies', 'Music', 'Equipment', 'Activewear', 'Camping', 'Kids Toys', 'Board Games', 'Video Games', 'Vitamins', 'Fitness Equipment', 'Monitoring Devices', 'Car Accessories', 'Maintenance', 'Motorcycle Gear', 'Rings', 'Watches', 'Necklaces', 'Stationery', 'Furniture', 'Electronics', 'Groceries', ' Snacks', 'Beverages', 'Pet Food', 'Accessories', 'Care products', 'Handmade', 'Customized']
const image = 'https://source.unsplash.com/collection/483251';
const Customer = require('../models/customer')
const ITEMS_PER_PAGE = 20;
const Notification = require('../models/notification');
const Seller = require('../models/seller');
const { notifySeller, notifyCustomer } = require('../socket');

module.exports.renderHome = (req, res) => {
    res.render('../views/customer/home', { categories, image })
}

///PRODUCTS SHOWING ROUTINGS 

module.exports.renderSearchedProducts = catchAsync(async (req, res) => {
    let { productName, page = 1 } = req.query;
    if (productName == "") {
        res.redirect('/customer/products?page=1')
    }
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const search1 = productName.replace(/[^\w\s]/g, '');
    const searchName1 = search1.toLowerCase().split(' ');
    const searchName2 = searchName1.join('');
    const products = await Product.find({ searchTerm: { $regex: searchName2 } }).skip(skip).limit(ITEMS_PER_PAGE);
    const totalProducts = await Product.countDocuments({ searchTerm: { $regex: searchName2 } });
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
    const newProducts = products.filter(product => {
        const launchDate = new Date(product.launchDate);
        const today = new Date();
        const twentyDaysAgo = new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000); // 10 days ago
        return launchDate > twentyDaysAgo;

    });
    res.render('./customer/search', { products, currentPage: page, totalPages, productName, searchName2, newProducts });
})

module.exports.renderSortedProducts = catchAsync(async (req, res) => {
    const { arrangement, productName, page = 1, pricing } = req.query;
    if ((arrangement && (arrangement === '123' || arrangement === '321')) || (pricing && (pricing === '123' || pricing === '321'))) {
        const skip = (page - 1) * ITEMS_PER_PAGE;
        const searchName2 = productName;
        let sortCriteria = {};
        if (arrangement === '123' || arrangement === '321') {
            sortCriteria.name = (arrangement === '123') ? 1 : -1;
        }
        if (pricing === '123' || pricing === '321') {
            sortCriteria.price = (pricing === '123') ? 1 : -1;
        }
        const products = await Product.find({ searchTerm: { $regex: searchName2 } })
            .sort(sortCriteria)
            .skip(skip)
            .limit(ITEMS_PER_PAGE);
        const totalProducts = await Product.countDocuments({ searchTerm: { $regex: searchName2 } });
        const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
        res.render('./customer/filters', { products, currentPage: page, totalPages, productName, searchName2, arrangement, pricing });
    } else {
        res.redirect(`/customer/products/search?productName=${productName}`);
    }
})

module.exports.showProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('reviews')
        .populate('queries')
        .populate('seller')
        .populate({
            path: 'reviews',
            populate: {
                path: 'author',
                model: 'Customer',
            },
        })
        .populate({
            path: 'queries',
            populate: [
                {
                    path: 'author',
                    model: 'Customer'
                }
            ],
        })

    // console.log({ answers:product.queries[0].answers[0].author})
    let sum = 0;
    for (let review of product.reviews) {
        sum += parseInt(review.rating);
        product.rating = sum / product.reviews.length;
    }
    const customerId = req.user._id;
    const customer = await Customer.findById(customerId);
    const favoriteProductIds = customer.favourites;
    res.render('../views/customer/show', { product, favoriteProductIds })
})

module.exports.renderProducts = catchAsync(async (req, res) => {
    const { page, productName } = req.query || 1;
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const products = await Product.find().skip(skip).limit(ITEMS_PER_PAGE);
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
    const newProducts = products.filter(product => {
        const launchDate = new Date(product.launchDate);
        const today = new Date();
        const twentyDaysAgo = new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000); // 10 days ago
        return launchDate > twentyDaysAgo;

    });
    res.render('../views/customer/index.ejs', { products, currentPage: page, totalPages, productName, newProducts });
})

///FAVOURITES ROUTINGS

module.exports.renderFavourites = catchAsync(async (req, res) => {
    const customer = await Customer.findById(req.user._id).populate('favourites');
    res.render('../views/customer/favourites', { customer })
})

module.exports.addFavourite = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const id = req.user._id;
    const customer = await Customer.findById(id);
    const product = await Product.findById(productId);
    customer.favourites.push(product);
    await customer.save();
    req.flash('success', "Great choice! You've added the product to your favorites");
    res.redirect(`/customer/products/${product.id}`)
})

module.exports.deleteFavourite = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const id = req.user._id;
    await Customer.findByIdAndUpdate(id, { $pull: { favourites: productId } });
    req.flash('error', 'Whoops! You deleted from your Favourites')
    res.redirect(`/customer/products/${productId}`)
})


///CART ROUTINGS 

module.exports.showCart = catchAsync(async (req, res) => {
    const customer = await Customer.findById(req.user._id).populate('cart');
    const undoProduct = req.session.undoProduct;
    let sum = 0
    for (let product of customer.cart) {
        sum += product.price
    }
    res.render('../views/customer/cart', { customer, undoProduct, sum })
})

module.exports.addToCart = catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    const customer = await Customer.findById(req.user._id).populate('cart');
    const isProductInCart = customer.cart.some(cartProduct => cartProduct.id === product.id);
    if (isProductInCart) {
        req.flash('error', ' Product already added to the cart!');
    } else {
        customer.cart.push(product);
        await customer.save();
        req.session.passport.user.cart = customer.cart;
        req.flash('success', 'Product added to the cart!');
    }
    const redirectUrl = res.locals.returnTo || '/customer/products?page=1';
    res.redirect(redirectUrl);
})

module.exports.addUndoProductToCart = catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    const customer = await Customer.findById(req.user._id).populate('cart');
    const isProductInCart = customer.cart.some(cartProduct => cartProduct.id === product.id);
    if (isProductInCart) {
        req.flash('error', ' Product already added to the cart!');
    } else {
        customer.cart.push(product);
        await customer.save();
        req.session.passport.user.cart = customer.cart;
        req.flash('success', 'Product retrived to the cart!');
    }
    res.redirect(`/customer/cart`);
})

module.exports.deleteProductFromCart = catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    const customer = await Customer.findByIdAndUpdate(req.user._id, { $pull: { cart: id } }, { new: true });
    req.session.passport.user = customer;
    req.session.undoProduct = { productId: id, productName: product.name }
    req.flash('error', `Whoops! deleted ${product.name} from your cart! 😓`)
    req.flash('cartInfo', `Want to retrieve ${product.name} `);
    res.redirect(`/customer/cart`)
})


///QUESTIONS AND ANSWERS ROUTINGS

///REAL TIME EVENTS ADDED ROUTES => { POSTQUERY }

module.exports.postQuery = catchAsync(async (req, res) => {
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
        notifySeller(seller.id, notification);
    } catch (e) {
        console.log(e);
    }
    req.flash('success', 'The question has been posted Successfully!')
    res.redirect(`/customer/products/${id}`);
});

module.exports.postAnswer = catchAsync(async (req, res) => {
    const { id, queryId } = req.params;
    const product = await Product.findById(id);
    const question = await Question.findById(queryId);
    const currentDate = new Date;
    question.answers.push({ answer: req.body.answer, author: { username: req.user.username, profile: req.user.profilePic }, date: currentDate.getTime(), authorRole: req.user.role });
    await question.save();
    await product.save();
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
    res.redirect(`/seller/products/${id}`);
    try {
        notifyCustomer(customer.id, notification);
    } catch (e) {
        console.log(e);
    }
});

module.exports.deleteQuery = catchAsync(async (req, res) => {
    const { id, queryId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { queries: queryId } })
    await Question.findByIdAndDelete(queryId);
    res.redirect(`/customer/products/${id}`);
})

///REVIEW ROUTINGS

module.exports.postReview = catchAsync(async (req, res) => {
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
    try {
        notifySeller(seller.id, notification);
    } catch (e) {
        console.log(e);
    }
    res.redirect(`/customer/products/${product.id}`)

})

module.exports.deleteReview = catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/customer/products/${id}`)
})

///CUSTOMER PROFILE ROUTINGS

module.exports.renderProfile = catchAsync(async (req, res) => {
    const customer = await Customer.findById(req.user._id)
    res.render('../views/customer/profile.ejs', { customer })
})

module.exports.updateProfile = catchAsync(async (req, res) => {
    const { customer , address} = req.body
    const updatedCustomer = await Customer.findByIdAndUpdate(req.user._id,     {
        username: customer.username,
        profilePic: customer.profilePic,
        mobile: customer.mobile,
        address: {
          street: address.street,
          city: address.city,
          state: address.state,
          country: address.country,
          pincode: address.pincode
        }
      },
      { new: true }
    );
    req.session.user = updatedCustomer;
    res.redirect('/customer/profile')
})


module.exports.renderNotificationPage = catchAsync(async (req, res) => {
    const customer = await Customer.findById(req.user._id).populate('notifications');
    res.render('../views/customer/notifications.ejs', { customer })
})