const express = require('express');
const router = express.Router();
const Seller = require('../models/seller')
const Product = require('../models/product')
const catchAsync = require('../utils/catchasync');
const passport = require('passport');

router.get('/all/sellers', catchAsync(async (req, res) => {
    const sellers = await Seller.find({})
    res.render('../views/seller/index.ejs', { sellers })
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate('products');
    res.render('../views/seller/custsell', { seller })
}))

router.get('/:id/product/new', catchAsync(async (req, res) => {
    const {id} = req.params;
    const seller = await Seller.findById(id)
    res.render('../views/seller/addProduct', {seller})
}))

router.post('/:id/product/new', catchAsync(async(req, res) =>{
    const {id} = req.params;
    const seller = await Seller.findById(id);
    const product = new Product(req.body.product);
    seller.products.push(product);
    await product.save();
    await seller.save();
    console.log(seller)
    res.redirect(`/seller/${id}`)
}))



module.exports = router