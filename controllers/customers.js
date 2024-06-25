///DECLARATIONS

const catchAsync = require('../utils/catchasync');
const Product = require('../models/product');
const Review = require('../models/review');
const Question = require('../models/question')
const categories = ['Computers', 'Mobiles', 'Cameras', 'Men"s', 'Women"s', 'Kids', 'Accessories', 'Decor', 'Kitchen', 'Bedding', 'Skincare', 'Haircare', 'Perfumes', 'Books', 'Movies', 'Music', 'Equipment', 'Activewear', 'Camping', 'Kids Toys', 'Board Games', 'Video Games', 'Vitamins', 'Fitness Equipment', 'Monitoring Devices', 'Car Accessories', 'MaparseFloatenance', 'Motorcycle Gear', 'Rings', 'Watches', 'Necklaces', 'Stationery', 'Furniture', 'Electronics', 'Groceries', ' Snacks', 'Beverages', 'Pet Food', 'Accessories', 'Care products', 'Handmade', 'Customized']
const image = 'https://source.unsplash.com/collection/483251';
const Customer = require('../models/customer')
const ITEMS_PER_PAGE = 20;
const Notification = require('../models/notification');
const Seller = require('../models/seller');
const Order = require('../models/order')
const { notifySeller, notifyCustomer } = require('../socket');
const catchasync = require('../utils/catchasync');
const populateOptions = {
    'computer': ['processor', 'storage', 'graphics', 'display', 'connectivities'],
    'mobile': ['storage', 'processor', 'camera', 'display', 'connectivity'],
    'camera': ['sensor', 'lens', 'video', 'display', 'connectivity'],
    'men': [],
    'women': [],
    'kids': [],
    'accessories': [],
    'decor': [],
    'kitchen': [],
    'bedding': [],
    'skincare': [],
    'haircare': [],
    'perfumes': [],
    'books': [],
    'movies': [],
    'music': [],
    'equipment': [],
    'activewear': [],
    'camping': [],
    'kidstoys': [],
    'boardgames': [],
    'videogames': [],
    'medicines': [],
    'fitnessequipment': [],
    'monitoringdevices': [],
    'caraccessories': [],
    'maparseFloatenance': [],
    'motorcyclegear': [],
    'ornaments': [],
    'stationary': [],
    'furniture': [],
    'electronics': [],
    'snacks': [],
    'groceries': [],
    'beverages': [],
    'petfood': [],
    'careproducts': [],
    'handmade': []
};

///RENDER HOME ROUTE

module.exports.renderHome = (req, res) => {
    res.render('../views/customer/home', { categories, image })
}

///PRODUCTS FILTER AND RETRIEVING ROUTES

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

///SHOW PRODUCT ROUTE

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
            populate: {
                path: 'answers'
            }
        })
        .populate({
            path: 'queries',
            populate: [
                {
                    path: 'author',
                    model: 'Customer'
                }
            ],
        }).populate({
            path: 'queries',
            populate: {
                path: 'answers',
                populate: [
                    { path: 'author.customer', model: 'Customer' },
                    { path: 'author.seller', model: 'Seller' }
                ]
            }
        });
    for (const category of Object.keys(populateOptions)) {
        if (product.details.category === category) {
            for (const field of populateOptions[category]) {
                await product.populate(`details.${field}`).execPopulate();
            }
            break; // No need to continue once populated
        }
    }
    let rated1 = 0, rated2 = 0, rated3 = 0, rated4 = 0, rated5 = 0;
    product.reviews.forEach(review => {
        if (review.rating == 1) {
            rated1 += 1;
        } else if (review.rating == 2) {
            rated2 += 1;
        } else if (review.rating == 3) {
            rated3 += 1
        } else if (review.rating == 4) {
            rated4 += 1;
        } else {
            rated5 += 1
        }
    })
    let allRatingsNumberWise = [
        rated1, rated2, rated3, rated4, rated5
    ]
    let percentages = allRatingsNumberWise.map(rating => ((rating / product.reviews.length) * 100).toFixed(2));
    const sameCategoryProducts = await Product.find({ category: product.category });
    const relatedProducts = await Product.find({ brand: product.brand });

    const getRandomSampleIndex = (array, sliceSize) => {
        if (array.length <= sliceSize) {
            return 0; // If array length is less than or equal to slice size, start from 0
        }
        return Math.floor(Math.random() * (array.length - sliceSize));
    };

    const sliceSize = 5; // Number of elements to slice

    let sameCategoryProductsStartIndex = getRandomSampleIndex(sameCategoryProducts, sliceSize);
    let relatedProductsStartIndex = getRandomSampleIndex(relatedProducts, sliceSize);

    const sameCategoryProductsSliced = sameCategoryProducts.slice(sameCategoryProductsStartIndex, sameCategoryProductsStartIndex + sliceSize);
    const relatedProductsSliced = relatedProducts.slice(relatedProductsStartIndex, relatedProductsStartIndex + sliceSize);

    let sum = 0;
    for (let review of product.reviews) {
        sum += parseFloat(review.rating);
        product.rating = sum / product.reviews.length;
    }
    const customerId = req.user._id;
    const customer = await Customer.findById(customerId);
    const favoriteProductIds = customer.favourites;
    const details = product.details
    res.render('../views/customer/show', { product, favoriteProductIds, details, relatedProductsSliced, sameCategoryProductsSliced, percentages })
})


///RENDER FAVOURITE ROUTES

module.exports.renderFavourites = catchAsync(async (req, res) => {
    const customer = await Customer.findById(req.user._id).populate('favourites');
    res.render('../views/customer/favourites', { customer })
})

///FAVOURITES CRUD ADD AND DELETE 

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


///SHOW CART ROUTE

module.exports.showCart = catchAsync(async (req, res) => {
    const customer = await Customer.findById(req.user._id).populate('cart');
    const undoProduct = req.session.undoProduct;
    let sum = 0
    for (let product of customer.cart) {
        sum += product.price
    }
    res.render('../views/customer/cart', { customer, undoProduct, sum })
})

///CART CRUD ADD DELETE UNDO-OPERATION

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
        req.session.user = customer;
        req.flash('success', 'Product added to the cart!');
    }
    const redirectUrl = res.locals.returnTo || `/customer/products/${product.id}`;
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


///QUERY CRUD ADD AND DELETE

module.exports.postQuery = catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('seller');
    const currentDate = new Date();
    const question = new Question(req.body.query);
    const tags = req.body.query.tag.split(',');
    for (let tag of tags) {
        question.tags.push(tag.trim())
    }
    question.author = req.user._id;
    question.date = currentDate;
    await question.save();
    product.queries.push(question);
    await product.save();
    const customer = await Customer.findById(req.user._id);
    customer.points = parseFloat(customer.points) + 0.2
    await customer.save();
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


module.exports.deleteQuery = catchAsync(async (req, res) => {
    const { id, queryId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { queries: queryId } })
    await Question.findByIdAndDelete(queryId);
    res.redirect(`/customer/products/${id}`);
})

///ANSWER CRUD ADD


module.exports.postAnswer = catchAsync(async (req, res) => {
    const { id, queryId } = req.params;
    const product = await Product.findById(id);
    const question = await Question.findById(queryId);
    const currentDate = new Date;
    const answer = {
        answer: req.body.answer,
        author: {
            customer: req.user._id
        },
        date: currentDate.getTime()
    }
    question.answers.push(answer);
    await question.save();
    await product.save();
    const customer = await Customer.findById(req.user._id);
    customer.points = parseFloat(customer.points) + 0.2
    await customer.save();
    const notification = new Notification({
        header: `New reply From ${req.user.username} ~ (${req.user.role})`,
        message: `${req.body.answer}`,
        timestamp: Date.now(),
        read: false,
        productName: product.name,
        productId: product.id,
        productSeller: product.seller._id
    });
    await notification.save();
    customer.notifications.unshift(notification);
    await customer.save();
    res.redirect(`/customer/products/${id}`);
    try {
        notifyCustomer(question.author._id, notification);
    } catch (e) {
        console.log(e);
    }
});

///REVIEWS CRUD ADD AND DELETE

module.exports.postReview = catchAsync(async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    const currentDate = new Date();
    review.date = currentDate;
    product.reviews.unshift(review);
    await review.save();
    await product.save();
    const customer = await Customer.findById(req.user._id);
    customer.points = parseFloat(customer.points) + 0.2
    await customer.save();
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
    const { customer, address } = req.body
    const updatedCustomer = await Customer.findByIdAndUpdate(req.user._id, {
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

///NOTIFICATION PAGE RENDER


module.exports.renderNotificationPage = catchAsync(async (req, res) => {
    const customer = await Customer.findById(req.user._id).populate('notifications');
    res.render('../views/customer/notifications.ejs', { customer })
})


//// BUYING ROUTINGS

module.exports.renderConfirmOrderPage = catchAsync(async (req, res) => {
    const { id } = req.params;
    const customer = await Customer.findById(req.user._id).populate('address');
    const product = await Product.findById(id);
    res.render("../views/customer/placeOrder.ejs", { customer, product })
})

module.exports.placeOrder = catchAsync(async (req, res) => {
    const { id } = req.params;
    const customer = await Customer.findById(req.user._id);
    const product = await Product.findById(id);
    const order = new Order({ product: product._id, orderDate: Date.now(), orderFrom: product.seller._id, orderTo: req.user._id, billingAddress: customer.address })
    await order.save();
    customer.orders.push(order)
    await customer.save();
    req.flash("success", "Yaaay, your order has been confirmed will delivered within 3 days!");
    res.redirect(`/customer/products/${id}`);
})


module.exports.renderYourOrders = catchAsync(async (req, res) => {
    const customer = await Customer.findById(req.user._id).populate('orders').populate({
        path: 'orders',
        populate: {
            path: 'product',
            model: 'Product',
        },
    })
    const orders = customer.orders;
    res.render('../views/customer/orders.ejs', { customer })
})

module.exports.renderOrderStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id).populate('product');
    res.render('../views/customer/orderstatus', { order })
})


/// SEARCH QUERIES AND REVIEWS

module.exports.searchQueriesAndReviews = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { text } = req.query;

    const product = await Product.findById(id)
        .populate({
            path: 'reviews',
            populate: { path: 'author', model: 'Customer' },
        })
        .populate({
            path: 'queries',
            populate: [
                { path: 'author', model: 'Customer' },
                {
                    path: 'answers',
                    populate: [
                        { path: 'author.customer', model: 'Customer' },
                        { path: 'author.seller', model: 'Seller' },
                    ],
                },
            ],
        });

    let resReviews = [];
    let resQueries = [];
    let resAnswers = [];

    product.reviews.forEach(review => {
        if (review.body.includes(text)) {
            resReviews.push(review);
        }
    });

    product.queries.forEach(query => {
        if (query.question.includes(text)) {
            resQueries.push(query);
        }
        query.answers.forEach(answer => {
            if (answer.answer.includes(text)) {
                resAnswers.push({ answer, question: query.question });
            }
        });
    });

    const results = { resReviews, resQueries, resAnswers };
    if (resReviews.length === 0 && resQueries.length === 0 && resAnswers.length === 0) {
        return res.render('../views/customer/nothingTemplate');
    } else {
        return res.render('../views/customer/searchResults', { product, results, text });
    }
});

///ZEN POINTS

module.exports.renderZenPointsPage = catchAsync(async (req, res) => {
    const customer = await Customer.findById(req.user._id);
    res.send(`Your points are ${customer.points}`)
})


///SHOW MORE ANSWERS FOR PARTICULAR QUESTIONS AND MORE REVIEWS PAGE

module.exports.renderViewAllQAS = catchAsync(async (req, res) => {
    const { productId, queryId } = req.params;
    const product = await Product.findById(productId);
    const query = await Question.findById(queryId);
    console.log(product)
    res.render('../views/customer/viewAllQAS', { product, query });
})