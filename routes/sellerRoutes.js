const express = require('express');
const router = express.Router();
const sellers = require('../controllers/sellers')
const { isSellerLoggedIn, validateReview, isReviewAuthor } = require('../utils/middleware')

router.get('/all/sellers', sellers.allSellers)

router.get('/home', isSellerLoggedIn, sellers.showSeller)

router.route('/products/:id/queries/:queryId')
    .post(sellers.postAnswer)
    .delete(sellers.deleteQuery)

router.route('/notifications')
    .get(sellers.showNotifications)

router.route('/profile')
    .get(sellers.renderProfilePage)

router.route('/profile/update')
.post(sellers.updateSellerProfile)

router.route('/products/:id')
    .get(sellers.viewProduct)
    .delete(sellers.deleteProduct)

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