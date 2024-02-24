const express = require('express');
const router = express.Router();
const Seller = require('../models/seller');
const catchAsync = require('../utils/catchasync');
const passport = require('passport');
const storeReturnTo = require('../utils/storeInfo');
const Customer = require('../models/customer')
///////////////////////CUSTOMER AUTHENTICATION ROUTES///////////////////////////////

router.get('/customer/auth/register', (req, res) => {
    res.render('../views/authentication//custauth/register')
})



router.post('/customer/auth/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password, role = 'customer' } = (req.body.customer);
        const customer = new Customer({ email, username, role });
        const registeredCustomer = await Customer.register(customer, password);
        req.login(registeredCustomer, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to Zen!`)
            console.log(customer.role)
            res.redirect('/customer/products')
        })
    } catch (e) {
        req.flash('error', `${e.message}`)
        res.redirect('/customer/register')
        console.log(e)
    }
}))



router.get('/customer/auth/login', (req, res) => {
    res.render('../views/authentication/custauth/login')
})


router.post('/customer/auth/login',
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('customerLocal', { failureFlash: true, failureRedirect: '/customer/auth/login' }),
    // Now we can use res.locals.returnTo to redirect the user after login
    (req, res) => {


        req.flash('success', `Welcome back! `);
        const redirectUrl = res.locals.returnTo || '/customer/products'; // update this line to use res.locals.returnTo now
        res.redirect(redirectUrl);
    });

router.get('/customer/auth/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/customer/products');
    });
})


///////////////////////////SELLER AUTHENTICATION ROUTES//////////////////////////////

router.get('/seller/auth/register', (req, res) => {
    res.render('../views/authentication/sellerauth/register')
})


router.post('/seller/auth/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password, role = 'seller' } = req.body.seller;
        const seller = new Seller({ email, username, role });
        const registeredSeller = await Seller.register(seller, password); // Provide username explicitly
        req.login(registeredSeller, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to Zen! ${registeredSeller.username}`)
            res.redirect('/customer/products')
        })
    } catch (e) {
        console.log(e)
        req.flash('error', `${e.message}`)
        res.redirect('/seller/auth/register')
        console.log(e)
    }
}))


router.get('/seller/auth/login', (req, res) => {
    res.render('../views/authentication/sellerauth/login')
})


router.post('/seller/auth/login',  storeReturnTo, passport.authenticate('sellerLocal', { failureFlash: true, failureRedirect: '/seller/auth/login' }),
    (req, res) => {
        const { username } = req.body;
        req.flash('success', `Welcome back! ${username}`);
        const redirectUrl = res.locals.returnTo || '/customer/products'; // update this line to use res.locals.returnTo now
        res.redirect(`${redirectUrl}`);
    });


router.get('/seller/auth/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/customer/products');
    });
})

module.exports = router