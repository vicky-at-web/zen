const express = require('express');
const router = express.Router();
const passport = require('passport');
const storeReturnTo = require('../utils/storeInfo');
const authentications = require('../controllers/authentications')

///CUSTOMER AUTHENTICATION ROUTES

router.route('/customer/auth/register')
    .get(authentications.renderRegisterForm)
    .post(authentications.registerCustomer)

router.route('/customer/auth/login')
    .get(authentications.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('customerLocal', { failureFlash: true, failureRedirect: '/customer/auth/login' }), authentications.loginCustomer);

router.get('/customer/auth/logout', authentications.loginOutCustomer)

///SELLER AUTHENTICATION ROUTES

router.route('/seller/auth/register')
    .get(authentications.renderSellerRegisterForm)
    .post(authentications.registerSeller)

router.route('/seller/auth/login')
    .get(authentications.renderSellerLoginForm)
    .post(storeReturnTo, passport.authenticate('sellerLocal', { failureFlash: true, failureRedirect: '/seller/auth/login' }), authentications.loginSeller);


router.get('/seller/auth/logout', authentications.logOutSeller)

module.exports = router