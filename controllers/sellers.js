const Seller = require('../models/seller')
const Product = require('../models/product')
const catchAsync = require('../utils/catchasync');

module.exports.allSellers = catchAsync(async (req, res) => {
    const sellers = await Seller.find({})
    res.render('../views/seller/index.ejs', { sellers })
})

module.exports.showSeller = catchAsync(async (req, res) => {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate('products');
    res.render('../views/seller/custsell', { seller })
})

module.exports.renderNewProductForm = catchAsync(async (req, res) => {
    const {id} = req.params;
    const seller = await Seller.findById(id)
    res.render('../views/seller/addProduct', {seller})
})

module.exports.addProduct = catchAsync(async(req, res) =>{
    const {id} = req.params;
    const seller = await Seller.findById(id);
    const product = new Product(req.body.product);
    seller.products.push(product);
    await product.save();
    await seller.save();
    res.redirect(`/seller/${id}`)
})