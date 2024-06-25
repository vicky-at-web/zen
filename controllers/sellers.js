///DECLARATIONS

const Seller = require('../models/seller')
const Product = require('../models/product')
const catchAsync = require('../utils/catchasync');
const Question = require('../models/question');
const Customer = require('../models/customer');
const { notifyCustomer } = require('../socket');
const Notification = require('../models/notification');
const details = require('../models/details')

///RENDER ALL SELLERS

module.exports.allSellers = catchAsync(async (req, res) => {
    const sellers = await Seller.find({})
    res.render('../views/seller/index.ejs', { sellers })
})

///SHOW SELLER

module.exports.showSeller = catchAsync(async (req, res) => {
    const seller = await Seller.findById(req.user._id).populate('products');
    const products = seller.products.slice(-5);
    res.render('../views/seller/home', { seller, products })
})

///VIEW PRODUCT FROM SELLER SIDE

module.exports.viewProduct = catchAsync(async (req, res) => {
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
        }).populate('details')
    let sum = 0;
    for (let review of product.reviews) {
        sum += parseInt(review.rating);
        product.rating = sum / product.reviews.length;
    }
    res.render('../views/seller/viewProduct', { product });
});

///POST ANSWER ROUTE FOR QA'S ASKED BY CUSTOMERS

module.exports.postAnswer = catchAsync(async (req, res) => {
    const { id, queryId } = req.params;
    const product = await Product.findById(id);
    const question = await Question.findById(queryId);
    const seller = await Seller.findById(req.user._id);
    const currentDate = new Date;
    const answer = {
        answer: req.body.answer,
        author: {
            seller: req.user._id
        },
        date: currentDate.getTime()
    }
    question.answers.push(answer);
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

///SHOW NOTIFICATIONS

module.exports.showNotifications = catchAsync(async (req, res) => {
    const seller = await Seller.findById(req.user._id).populate('notifications')
    res.render('../views/seller/notifications', { seller })
})

///PROFILE VIEW AND UPDATE 

module.exports.renderProfilePage = catchAsync(async (req, res) => {
    const seller = await Seller.findById(req.user._id);
    res.render('../views/seller/profile', { seller })
})

module.exports.updateSellerProfile = catchAsync(async (req, res) => {
    const seller = await Seller.findByIdAndUpdate(req.user._id, { ...req.body.seller })
    req.session.user = seller;
    res.redirect('/seller/home')
})

////PRODUCT RELATED ROUTES

/// PRODUCT CRUD FORMS RENDERS

module.exports.renderNewProductForm = catchAsync(async (req, res) => {
    const seller = await Seller.findById(req.user._id)
    res.render('../views/seller/createProduct', { seller })
})

module.exports.renderProductEditForm = catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product, product.details)
    res.render("../views/seller/editProduct", { product })
});

module.exports.renderProductDetailsForm = catchAsync(async (req, res) => {
    const category = req.session.product.category;
    if (req.session.product) {
        res.render(`../views/seller/pdForms/${category.toLowerCase()}`, { category })
    } else {
        req.flash('error', 'you are not authorized to do that')
        res.redirect("/seller/home");

    }
})

///PRODUCT CRUD OPERATIONS ADD DELETE UPDATE 

module.exports.addProduct = catchAsync(async (req, res) => {
    const { values, keys } = req.body
    const product = new Product(req.body.product)
    product.launchDate = new Date();
    product.seller = req.user._id;
    const combinedObject = {};
    for (let i = 0; i < keys.length; i++) {
        combinedObject[keys[i]] = values[i];
    }
    product.details = combinedObject;
    // const sanitizedProductName = product.name.replace(/[^\w\s]/g, '').toLowerCase().split(' ');
    // product.searchTerm = sanitizedProductName.join('');
    // req.session.product = product;
    // res.redirect(`/seller/product/new/details`)
    res.send(product)
})

module.exports.addProductDetails = catchAsync(async (req, res) => {
    //     const productDetails = req.body;
    //     const product = new Product(req.session.product);
    //     product.launchDate = new Date();
    //     product.seller = req.user._id;
    //     product.details = productDetails;
    //     await product.save();
    //     const seller = await Seller.findById(req.user._id);
    //     seller.products.push(product._id);
    //     await seller.save();
    //     res.redirect(`/seller/products/${product.id}`)
})

module.exports.updateProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { product } = req.body
    const sanitizedProductName = product.name.replace(/[^\w\s]/g, '').toLowerCase().split(' ');
    product.searchTerm = sanitizedProductName.join('');
    const productDetails = `${product.category.toLowerCase()}DetailsSchema`;
    product.details = details[productDetails]
    const updatedProduct = await Product.findByIdAndUpdate(id, { ...product });
    console.log(product)
    res.redirect(`/seller/products/${id}`)
})

module.exports.deleteProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the product')
    res.redirect('/seller/home')
})