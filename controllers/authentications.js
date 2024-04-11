const Seller = require('../models/seller');
const catchAsync = require('../utils/catchasync');
const Customer = require('../models/customer')

///CUSTOMER AUTH ROUTINGS

module.exports.renderRegisterForm = (req, res) => {
    res.render('../views/authentication//custauth/register')
}

module.exports.registerCustomer = catchAsync(async (req, res) => {
    try {
        const { email, username, password, role = 'customer' } = (req.body.customer);
        const customer = new Customer({ email, username, role });
        const registeredCustomer = await Customer.register(customer, password);
        req.login(registeredCustomer, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to Zen!`)
            res.redirect('/customer/products')
        })
    } catch (e) {
        req.flash('error', `${e.message}`)
        res.redirect('/customer/register')

        console.log(e)
    }
})

module.exports.renderLoginForm = (req, res) => {
    res.render('../views/authentication/custauth/login')
}

module.exports.loginCustomer =  (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome back! ${username}`);
    const redirectUrl = res.locals.returnTo || '/customer/products'; 
    res.redirect(redirectUrl);
}

module.exports.loginOutCustomer = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/customer/products');
    });
}

///SELLER AUTH ROUTINGS

module.exports.renderSellerRegisterForm = (req, res) => {
    res.render('../views/authentication/sellerauth/register')
}

module.exports.registerSeller = catchAsync(async (req, res) => {
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
})

module.exports.renderSellerLoginForm = (req, res) => {
    res.render('../views/authentication/sellerauth/login')
}

module.exports.loginSeller = (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome back! ${username}`);
    const redirectUrl = res.locals.returnTo || '/customer/products'; // update this line to use res.locals.returnTo now
    res.redirect(`${redirectUrl}`);
}

module.exports.logOutSeller = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/customer/products');
    });
}