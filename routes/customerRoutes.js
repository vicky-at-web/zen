const express = require('express');
const Product = require('../models/product');
const Review = require('../models/review');
const catchAsync = require('../utils/catchasync');
const { reviewSchema } = require('../schemas/schema');
const expErr = require('../utils/expressErr');
const Question = require('../models/question')

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

router.get('/products', catchAsync(async (req, res) => {
    const products = await Product.find();
    res.render('../views/customer/index.ejs', { products })

}))

router.get('/products/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('reviews').populate('queries');
    let sum = 0;
    for (let review of product.reviews) {
        sum += parseInt(review.rating);
        product.rating = sum / product.reviews.length;
    }
    res.render('../views/customer/show', { product })
}))

router.get('/:id/cart', catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('../views/customer/cart', { product })
}))

///QUERIES ROUTES START

router.post('/products/:id/queries', catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    const question = new Question(req.body.query);
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
    question.answers.push(req.body.query);
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