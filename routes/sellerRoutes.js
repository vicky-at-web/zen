const express = require('express');
const router = express.Router();
const sellers = require('../controllers/sellers')
const { isSellerLoggedIn, validateReview, isReviewAuthor } = require('../utils/middleware')

///ALL SELLERS ROUTES

router.get('/all/sellers', sellers.allSellers)

///HOME ROUTES

router.get('/home', isSellerLoggedIn, sellers.showSeller)

///QUERY REPLY ROUTES

router.route('/products/:id/queries/:queryId')
    .post(sellers.postAnswer)

///RENDER NOTIFICATION

router.route('/notifications')
    .get(sellers.showNotifications)

///PROFILE UPDATE ROUTES

router.route('/profile')
    .get(sellers.renderProfilePage)

router.route('/profile/update')
    .put(sellers.updateSellerProfile)

///PRODUCT ROUTES FROM SELLER SIDE

router.route('/products/:id')
    .get(sellers.viewProduct)
    .delete(sellers.deleteProduct)

/// PRODUCT CRUD
router.route('/products/:id/edit')
    .get(sellers.renderProductEditForm)
    .put(sellers.updateProduct)

router.route('/product/new/basic')
    .get(sellers.renderNewProductForm)
    .post(sellers.addProduct)

router.route('/product/new/details')
    .get(sellers.renderProductDetailsForm)
    .post(sellers.addProductDetails)

module.exports = router