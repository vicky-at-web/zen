const express = require('express');
const router = express.Router();
const passport = require('passport');
const storeReturnTo = require('../utils/storeInfo');
const authentications = require('../controllers/authentications')

///CUSTOMER AUTHENTICATION ROUTES

///REGISTRATION FORMS GET AND POST

router.route('/customer/auth/register')
    .get(authentications.renderRegisterForm)
    .post(authentications.registerCustomer)

///LOGIN FORMS GET AND POST

router.route('/customer/auth/login')
    .get(authentications.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('customerLocal', { failureFlash: true, failureRedirect: '/customer/auth/login' }), authentications.loginCustomer);

///LOGOUT FORM

router.get('/customer/auth/logout', authentications.loginOutCustomer)

///SELLER AUTHENTICATION ROUTES

///REGISTRATION FORMS GET AND POST

router.route('/seller/auth/register')
    .get(authentications.renderSellerRegisterForm)
    .post(authentications.registerSeller)

///LOGIN FORMS GET AND POST

router.route('/seller/auth/login')
    .get(authentications.renderSellerLoginForm)
    .post(storeReturnTo, passport.authenticate('sellerLocal', { failureFlash: true, failureRedirect: '/seller/auth/login' }), authentications.loginSeller);

///LOGOUT FORM

router.get('/seller/auth/logout', authentications.logOutSeller)

module.exports = router