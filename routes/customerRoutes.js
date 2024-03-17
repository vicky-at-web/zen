const express = require('express');
const Product = require('../models/product');
const Review = require('../models/review');
const catchAsync = require('../utils/catchasync');
const isLoggedIn = require('../utils/isLoggedIn')
const { reviewSchema } = require('../schemas/schema');
const expErr = require('../utils/expressErr');
const Question = require('../models/question')
const Customer = require('../models/customer')
const categories = ['Computers', 'Mobiles', 'Cameras', 'Men"s', 'Women"s', 'Kids', 'Accessories', 'Decor', 'Kitchen', 'Bedding', 'Skincare', 'Haircare', 'Perfumes', 'Books', 'Movies', 'Music', 'Equipment', 'Activewear', 'Camping', 'Kids Toys', 'Board Games', 'Video Games', 'Vitamins', 'Fitness Equipment', 'Monitoring Devices', 'Car Accessories', 'Maintenance', 'Motorcycle Gear', 'Rings', 'Watches', 'Necklaces', 'Stationery', 'Furniture', 'Electronics', 'Groceries', ' Snacks', 'Beverages', 'Pet Food', 'Accessories', 'Care products', 'Handmade', 'Customized']
const image = 'https://source.unsplash.com/collection/483251';
const ITEMS_PER_PAGE = 20;
const router = express.Router();


//// MIDDLEWARES STARTS

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expErr(msg, 400)
    } else {
        next();
    }
}

/// MIDDLEWARES END


router.get('/home', (req, res) => {
    res.render('../views/customer/home', { categories, image })
})

router.get('/products', catchAsync(async (req, res) => {
    const { page, productName } = req.query || 1;
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const products = await Product.find().skip(skip).limit(ITEMS_PER_PAGE);
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
    console.log(totalPages)
    const newProducts = products.filter(product => {
        const launchDate = new Date(product.launchDate);
        const today = new Date();
        const twentyDaysAgo = new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000); // 10 days ago
        return launchDate > twentyDaysAgo;

    });
    console.log(newProducts)
    res.render('../views/customer/index.ejs', { products, currentPage: page, totalPages, productName, newProducts });
}))



router.get('/products/search', catchAsync(async (req, res) => {
    let { productName, page = 1 } = req.query;
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const search1 = productName.replace(/[^\w\s]/g, '');
    const searchName1 = search1.toLowerCase().split(' ');
    const searchName2 = searchName1.join('');
    const products = await Product.find({ searchTerm: { $regex: searchName2 } }).skip(skip).limit(ITEMS_PER_PAGE);
    const totalProducts = await Product.countDocuments({ searchTerm: { $regex: searchName2 } });
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
    console.log(totalPages, totalProducts, page)
    console.log(typeof (totalPages))
    const newProducts = products.filter(product => {
        const launchDate = new Date(product.launchDate);
        const today = new Date();
        const twentyDaysAgo = new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000); // 10 days ago
        return launchDate > twentyDaysAgo;

    });
    res.render('./customer/search', { products, currentPage: page, totalPages, productName, searchName2, newProducts });
}))


router.get('/products/sort/filter', catchAsync(async (req, res) => {
    const { arrangement, productName, page = 1, pricing } = req.query;
    if ((arrangement && (arrangement === '123' || arrangement === '321')) || (pricing && (pricing === '123' || pricing === '321'))) {
        const skip = (page - 1) * ITEMS_PER_PAGE;
        const searchName2 = productName;
        let sortCriteria = {}; // Initialize sortCriteria object

        // Sort by name
        if (arrangement === '123' || arrangement === '321') {
            sortCriteria.name = (arrangement === '123') ? 1 : -1;
        }

        // Sort by price
        if (pricing === '123' || pricing === '321') {
            sortCriteria.price = (pricing === '123') ? 1 : -1;
        }
        // Query products with searchName2 and apply sorting criteria
        const products = await Product.find({ searchTerm: { $regex: searchName2 } })
            .sort(sortCriteria) // Apply sorting criteria
            .skip(skip)
            .limit(ITEMS_PER_PAGE);

        // Retrieve total count of products for pagination
        const totalProducts = await Product.countDocuments({ searchTerm: { $regex: searchName2 } });
        const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
        console.log(totalPages, totalProducts, page);
        res.render('./customer/filters', { products, currentPage: page, totalPages, productName, searchName2, arrangement, pricing });
    } else {
        // Redirect if sorting parameters are invalid
        res.redirect(`/customer/products/search?productName=${productName}`);
    }
}));






router.put('/profile/:id/update', catchAsync(async (req, res) => {
    const { id } = req.params;
    const customer = await Customer.findOneAndUpdate(
        { _id: id },
        { $set: req.body },
        { new: true, runValidators: true }
    );
    req.session.passport.user = customer.toObject();
    res.redirect('/customer/products?page=1')
}))


router.get('/profile/:id/view', catchAsync(async (req, res) => {
    const { id } = req.params;
    const customer = await Customer.findById(id)
    res.render('../views/customer/profile.ejs', { customer })
}))

router.post('/:id/products/favourite/:productId', catchAsync(async (req, res) => {
    const { id, productId } = req.params;
    const customer = await Customer.findById(id);
    const product = await Product.findById(productId);
    customer.favourites.push(product);
    await customer.save();
    console.log(customer);
    req.flash('success', "Great choice! You've added the product to your favorites");
    res.redirect(`/customer/products/${product.id}`)
}))


router.delete('/:id/products/favourites/:productId', catchAsync(async (req, res) => {
    const { id, productId } = req.params;
    await Customer.findByIdAndUpdate(id, { $pull: { favourites: productId } });
    console.log('Customer Id:', id, 'Product Id:', productId)
    req.flash('error', 'Whoops! You deleted from your Favourites')
    res.redirect(`/customer/products/${productId}`)
}))


router.get('/:id/products/favourites', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const customer = await Customer.findById(id).populate('favourites');
    res.render('../views/customer/favourites', { customer })
}))


router.get('/products/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('reviews').populate('queries').populate({
        path: 'reviews',
        populate: {
            path: 'author',
            model: 'Customer',
        },
    }).populate({
        path: 'queries',
        populate: {
            path: 'author',
            model: 'Customer'
        }
    }).populate({
        path: 'queries',
        populate: {
            path: 'answers.author',
            model: 'Customer'
        }
    });



    let sum = 0;
    for (let review of product.reviews) {
        sum += parseInt(review.rating);
        product.rating = sum / product.reviews.length;
    }

    console.log('product')
    console.log(product)
    const customerId = req.user._id;
    const customer = await Customer.findById(customerId);
    const favoriteProductIds = customer.favourites;
    res.render('../views/customer/show', { product, favoriteProductIds })
}))

router.post('/:customerId/:id/cart', catchAsync(async (req, res) => {
    const { id, customerId } = req.params;
    const product = await Product.findById(id);
    const customer = await Customer.findById(customerId).populate('cart');
    const isProductInCart = customer.cart.some(cartProduct => cartProduct.id === product.id);
    if (isProductInCart) {
        req.flash('error', ' Product already added to the cart!');
    } else {
        customer.cart.push(product);
        await customer.save();
        req.session.passport.user.cart = customer.cart;
        req.flash('success', 'Product added to the cart!');
    }
    res.redirect('/customer/products?page=1');
}));

router.post('/:customerId/:id/undocart', catchAsync(async (req, res) => {
    const { id, customerId } = req.params;
    const product = await Product.findById(id);
    const customer = await Customer.findById(customerId).populate('cart');
    const isProductInCart = customer.cart.some(cartProduct => cartProduct.id === product.id);
    if (isProductInCart) {
        req.flash('error', ' Product already added to the cart!');
    } else {
        customer.cart.push(product);
        await customer.save();
        req.session.passport.user.cart = customer.cart;
        req.flash('success', 'Product retrived to the cart!');
    }
    res.redirect(`/customer/${customer.id}/cart`);
}));


router.delete('/products/:id/cart/:productId', catchAsync(async (req, res) => {
    const { id, productId } = req.params;
    const product = await Product.findById(productId);
    const customer = await Customer.findByIdAndUpdate(id, { $pull: { cart: productId } }, { new: true });
    req.session.passport.user = customer;
    console.log(customer)
    req.session.undoProduct = { productId: productId, productName: product.name }
    req.flash('error', `Whoops! deleted ${product.name} from your cart! 😓`)
    req.flash('cartInfo', `Want to retrieve ${product.name} `);
    res.redirect(`/customer/${customer.id}/cart`)
}))


router.get('/:customerId/cart', catchAsync(async (req, res) => {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId).populate('cart');
    const undoProduct = req.session.undoProduct;
    let quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    res.render('../views/customer/cart', { customer, undoProduct, quantities })

}))

///QUERIES ROUTES START

router.post('/products/:id/queries', catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    const question = new Question(req.body.query);
    question.author = req.user._id;
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    question.date = formattedDate
    product.queries.push(question)
    await question.save();
    await product.save();
    req.flash('success', 'Welcome to Zen!')
    res.redirect(`/customer/products/${id}`);
}));

router.post('/products/:id/queries/:queryId', catchAsync(async (req, res) => {
    const { id, queryId } = req.params;
    const product = await Product.findById(id);
    const question = await Question.findById(queryId);
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    question.answers.push({ answer: req.body.answer, author: req.user._id, date: formattedDate });
    await question.save();
    await product.save();
    res.redirect(`/customer/products/${id}`);
}))

router.delete('/products/:id/:queryId/queries', catchAsync(async (req, res) => {
    const { id, queryId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { queries: queryId } })
    await Question.findByIdAndDelete(queryId);
    res.redirect(`/customer/products/${id}`);
}))

///QUERIES ROUTES END

////REVIEW ROUTES START
router.post('/products/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    review.date = formattedDate;
    product.reviews.push(review);
    await review.save();
    await product.save();
    res.redirect(`/customer/products/${product.id}`)
}))

router.delete('/products/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/customer/products/${id}`)

}))

////REVIEW ROUTES END


module.exports = router