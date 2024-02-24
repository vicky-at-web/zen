const isLoggedIn = (req, res, next) =>{
    console.log(req.user)
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in first');
        return res.redirect('/customer/login')
    }
    next()
}




module.exports = isLoggedIn