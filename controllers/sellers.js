const Seller = require('../models/seller')
const Product = require('../models/product')
const catchAsync = require('../utils/catchasync');
const Question = require('../models/question')

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


module.exports.deleteProduct = catchAsync(async(req, res) =>{
    const {id} = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the product')
    res.redirect('/seller/home')
})

module.exports.postQuery = catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    const currentDate = new Date();
    const question = new Question(req.body.query);
    question.author = req.user._id;
    question.date = currentDate
    product.queries.push(question);
    await question.save();
    await product.save();
    req.flash('success', 'The question has been posted Successfully!')
    res.redirect(`/customer/products/${id}`);
})

module.exports.postAnswer = catchAsync(async (req, res) => {
    const { id, queryId } = req.params;
    const product = await Product.findById(id);
    const question = await Question.findById(queryId);
    const currentDate = new Date();
    question.answers.push({ answer: req.body.answer, author: {username: req.user.username, profile: req.user.imageUrl}, date: currentDate, authorRole: req.user.role });
    await question.save();
    await product.save();
    res.redirect(`/seller/products/${id}`);
})

module.exports.deleteQuery = catchAsync(async (req, res) => {
    const { id, queryId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { queries: queryId } })
    await Question.findByIdAndDelete(queryId);
    res.redirect(`/seller/products/${id}`);
})
