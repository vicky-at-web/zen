const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor, isReviewAuthor, validateReview } = require('../utils/middleware')
const customers = require('../controllers/customers')

///HOME ROUTES

router.get('/home', customers.renderHome)

///PRODUCT ROUTES

router.get('/products', customers.renderProducts)

router.get('/products/:id', isLoggedIn, customers.showProduct)

router.get('/products/search', customers.renderSearchedProducts)

router.get('/products/sort/filter', customers.renderSortedProducts);

///CUSTOMER PROFILE ROUTES

router.get('/profile/:id/view', customers.renderProfile)

router.put('/profile/:id/update', customers.updateProfile)

///FAVOURITES ROUTE

router.get('/:id/products/favourites', isLoggedIn, customers.renderFavourite)

router.post('/:id/products/favourite/:productId', customers.addFavourite)

router.delete('/:id/products/favourites/:productId', customers.deleteFavourite)

///CART ROUTES

router.get('/:customerId/cart', customers.showCart)

router.post('/:customerId/:id/cart', customers.addToCart);

router.post('/:customerId/:id/undocart', customers.addUndoProductToCart);

router.delete('/products/:id/cart/:productId', customers.deleteProductFromCart)

///QUERIES ROUTES

router.post('/products/:id/queries', customers.postQuery);

router.post('/products/:id/queries/:queryId', customers.postAnswer)

router.delete('/products/:id/:queryId/queries', customers.deleteQuery)

////REVIEW ROUTES 

router.post('/products/:id/reviews', validateReview, customers.postReview)

router.delete('/products/:id/reviews/:reviewId', isReviewAuthor, customers.deleteReview)




module.exports = router