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
    const { id } = req.params;
    const seller = await Seller.findById(id)
    res.render('../views/seller/createProduct', { seller })
})

module.exports.addProduct = catchAsync(async (req, res) => {
    const product = new Product(req.body.product);
    await product.save();
    await product.populate('details');
    console.log({ product: product, productDetails: product.details })
    res.send(product)
})

// const mongoose = require('mongoose');
// const { Schema } = mongoose;
// const Question = require('./question');
// const Review = require('./review');
// const {
//     computerDetailsSchema,
//     mobileDetailsSchema,
//     cameraDetailsSchema,
//     menDetailsSchema,
//     womensDetailsSchema,
//     kidsDetailsSchema,
//     accessoriesDetailsSchema,
//     decorDetailsSchema,
//     kitchenDetailsSchema,
//     beddingDetailsSchema,
//     skincareDetailsSchema,
//     haircareDetailsSchema,
//     perfumesDetailsSchema,
//     booksDetailsSchema,
//     moviesDetailsSchema,
//     musicDetailsSchema,
//     equipmentDetailsSchema,
//     activewearDetailsSchema,
//     campingDetailsSchema,
//     kidsToysDetailsSchema,
//     boardGamesDetailsSchema,
//     videoGamesDetailsSchema,
//     monitoringDevicesDetailsSchema,
//     fitnessEquipmentDetailsSchema,
//     medicinesDetailsSchema,
//     carAccessoriesDetailsSchema,
//     maintenanceDetailsSchema,
//     motorcycleGearDetailsSchema,
//     ornamentsDetailsSchema,
//     stationeryDetailsSchema,
//     furnitureDetailsSchema,
//     electronicsDetailsSchema,
//     groceriesDetailsSchema,
//     snacksDetailsSchema,
//     beveragesDetailsSchema,
//     petFoodDetailsSchema,
//     careProductsDetailsSchema,
//     handmadeDetailsSchema
// } = require('./details');



// const productSchema = new Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     imageUrl: [{
//         type: String,
//     }],
//     description: {
//         type: String,
//     },
//     searchTerm: [{
//         type: String,
//     }],
//     price: {
//         type: Number
//     },
//     category: {
//         type: String,
//         enum: ['Computers', 'Mobiles', 'Cameras', 'Men"s', 'Women"s', 'Kids', 'Accessories', 'Decor', 'Kitchen', 'Bedding', 'Skincare', 'Haircare', 'Perfumes', 'Books', 'Movies', 'Music', 'Equipment', 'Activewear', 'Camping', 'Kids Toys', 'Board Games', 'Video Games', 'Medicines', 'Fitness Equipment', 'Monitoring Devices', 'Car Accessories', 'Maintenance', 'Motorcycle Gear', 'Ornaments', 'Stationery', 'Furniture', 'Electronics', 'Groceries', ' Snacks', 'Beverages', 'Pet Food', 'Care products', 'Handmade']
//     },
//     reviews: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Review'
//     }],
//     rating: {
//         type: String,
//         default: 0
//     },
//     queries: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Question'
//     }],

//     brand: {
//         type: String,
//     },
//     headers: {
//         type: String,
//     },
//     launchDate: {
//         type: Date
//     },
//     seller: {
//         type: Schema.Types.ObjectId,
//         ref: 'Seller'
//     },
//     details: {
//         type: Schema.Types.Mixed
//     }
// })


// productSchema.post('findOneAndDelete', async function (doc) {
//     if (doc) {
//         await Review.deleteMany({ _id: { $in: doc.reviews } });
//         await Question.deleteMany({ _id: { $in: doc.queries } });
//     }
// });





// const Product = mongoose.model('Product', productSchema);

// module.exports = Product