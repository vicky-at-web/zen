const Seller = require('../models/seller')
const Product = require('../models/product')
const catchAsync = require('../utils/catchasync');
const Customer = require('../models/customer');
const Review = require('../models/review')

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

module.exports.viewProduct = catchAsync(async(req, res) =>{
    const { id } = req.params;
    const product = await Product.findById(id)
        .populate('reviews')
        .populate('queries')
        .populate('seller')
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate({
            path: 'queries',
            populate: {
                path: 'author',
                model: 'Customer'
            }
        })
        .populate({
            path: 'queries',
            populate: {
                path: 'answers.author',
                model: 'Customer'
            }
        })
       

    let sum = 0;
    for (let review of product.reviews) {
        sum += parseInt(review.rating);
    }
    if (product.reviews.length > 0) {
        product.rating = sum / product.reviews.length;
    } else {
        product.rating = 0; // Set rating to 0 if there are no reviews
    }

    console.log(product.reviews);
    res.render('../views/seller/viewProduct', { product });
});



module.exports.deleteProduct = catchAsync(async(req, res) =>{
    const {id} = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the product')
    res.redirect('/seller/home')
})

module.exports.postReview = catchAsync(async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    const currentDate = new Date();
    review.date = currentDate;
    review.authorType = req.user.role
    product.reviews.push(review);
    await review.save();
    await product.save();
    res.redirect(`/seller/products/${product.id}`)
})

module.exports.deleteReview = catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/seller/products/${id}`)
})

