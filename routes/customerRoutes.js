const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor, isReviewAuthor, validateReview } = require('../utils/middleware')
const customers = require('../controllers/customers')
const storeReturnTo = require('../utils/storeInfo');
const catchAsync = require('../utils/catchasync')

///HOME ROUTES

router.get('/home', customers.renderHome)

///PRODUCT ROUTES

router.get('/products', customers.renderProducts)

router.get('/products/search', customers.renderSearchedProducts)

router.get('/products/:id', isLoggedIn, customers.showProduct)

router.get('/products/sort/filter', customers.renderSortedProducts);

///CUSTOMER PROFILE ROUTES

router.route('/profile')
    .get(customers.renderProfile)
    .put(customers.updateProfile)

///FAVOURITES ROUTE

router.get('/favourites', isLoggedIn, customers.renderFavourites)

router.route('/:productId/products/favourites')
    .post(customers.addFavourite)
    .delete(customers.deleteFavourite)

///CART ROUTES

router.get('/cart', isLoggedIn, customers.showCart)

router.post('/:id/undocart', customers.addUndoProductToCart);

router.route('/:id/cart')
    .post(storeReturnTo, isLoggedIn, customers.addToCart)
    .delete(customers.deleteProductFromCart)

///QUERIES ROUTES

router.route('/products/:id/queries')
    .post(customers.postQuery)

router.route('/products/:id/queries/:queryId')
    .post(customers.postAnswer)
    .delete(customers.deleteQuery)

////REVIEW ROUTES 

router.post('/products/:id/reviews', validateReview, customers.postReview)

router.delete('/products/:id/reviews/:reviewId', isReviewAuthor, customers.deleteReview)

///NOTIFICATION ROUTES

router.get('/notifications', isLoggedIn, customers.renderNotificationPage)

//BUYING ROUTES

router.route('/:id/buynow')
    .get(customers.renderConfirmOrderPage)
    .post(customers.placeOrder)

router.get('/orders', customers.renderYourOrders)

router.get('/order/:id/status', customers.renderOrderStatus)


/// SEARCHING OVER QUERIES AND REVIEWS

router.get('/product/:id/searchqueries&reviews', customers.searchQueriesAndReviews);

router.get('/zenpoints', customers.renderZenPointsPage)

router.get('/product/:productId/QAS/:queryId', customers.renderViewAllQAS)


module.exports = router