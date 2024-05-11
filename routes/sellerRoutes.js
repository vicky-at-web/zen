const express = require('express');
const router = express.Router();
const sellers = require('../controllers/sellers')
const { isSellerLoggedIn, validateReview, isReviewAuthor } = require('../utils/middleware')

router.get('/all/sellers', sellers.allSellers)

router.get('/home', isSellerLoggedIn, sellers.showSeller)

router.route('/:id/product/new')
    .get(sellers.renderNewProductForm)
    .post(sellers.addProduct)

router.route('/products/:id')
    .get(sellers.viewProduct)
    .delete(sellers.deleteProduct)

router.post('/products/:id/reviews', validateReview, sellers.postReview)

router.delete('/products/:id/reviews/:reviewId', isReviewAuthor, sellers.deleteReview)

module.exports = router