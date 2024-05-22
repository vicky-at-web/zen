const Seller = require('../models/seller')
const Product = require('../models/product')
const catchAsync = require('../utils/catchasync');
const Question = require('../models/question');
const Customer = require('../models/customer');
const { notifyCustomer} = require('../socket');
const Notification = require('../models/notification')

module.exports.allSellers = catchAsync(async (req, res) => {
    const sellers = await Seller.find({})
    res.render('../views/seller/index.ejs', { sellers })
})

module.exports.showSeller = catchAsync(async (req, res) => {
    const seller = await Seller.findById(req.user._id).populate('products');
    const products = seller.products.slice(-5);
    res.render('../views/seller/home', { seller, products })
})

module.exports.renderNewProductForm = catchAsync(async (req, res) => {
    const { id } = req.params;
    const seller = await Seller.findById(id)
    res.render('../views/seller/createProduct', { seller })
})

module.exports.addProduct = catchAsync(async (req, res) => {
    const product = new Product(req.body.product);
    await product.save();
    await product.populate('details');
    console.log({ product: product, productDetails: product.details })
    res.send(product)
})

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
        });
    // console.log(product.queries[0].answers)
    let sum = 0;
    for (let review of product.reviews) {
        sum += parseInt(review.rating);
        product.rating = sum / product.reviews.length;
    }
    res.render('../views/seller/viewProduct', { product });
});


module.exports.deleteProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the product')
    res.redirect('/seller/home')
})

module.exports.postAnswer = catchAsync(async (req, res) => {
    const { id, queryId } = req.params;
    const product = await Product.findById(id);
    const question = await Question.findById(queryId);
    const seller = await Seller.findById(req.user._id);
    const currentDate = new Date;
    question.answers.push({ answer: req.body.answer, author: { username: seller.username, profile: seller.imageUrl }, date: currentDate.getTime(), authorRole: seller.role });
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
    res.redirect(`/seller/products/${id}`);
})

module.exports.showNotifications = catchAsync(async (req, res) => {
    const seller = await Seller.findById(req.user._id).populate('notifications')
    res.render('../views/seller/notifications', { seller })
})

module.exports.renderProfilePage = catchAsync(async(req, res) =>{
    const seller = await Seller.findById(req.user._id);
    res.render('../views/seller/profile', { seller })
})

module.exports.updateSellerProfile = catchAsync(async(req, res) =>{
    const seller = await Seller.findByIdAndUpdate(req.user._id, {...req.body.seller})
    req.session.passport.user = seller;
    res.redirect('/seller/home')
})