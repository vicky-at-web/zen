const Review = require('../models/review.js');
const catchAsync = require('./catchasync.js');



module.exports.isLoggedIn = (req, res, next) =>{
    console.log(req.user)
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in first');
        return res.redirect('/customer/auth/login')
    }
    next()
}

module.exports.isAuthor = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
})

module.exports.isReviewAuthor = catchAsync(async (req, res, next) => {
    const { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that!')
        return res.redirect(`/customer/products/${id}`)
    }
    next();
})

