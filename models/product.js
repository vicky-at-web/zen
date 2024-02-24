const mongoose = require('mongoose');
const { Schema } = mongoose;
const Question = require('./question');
const Review = require('./review')

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: [{
        type: String,
    }],
    description: {
        type: String,
    },
    price: {
        type: Number
    },
    category: {
        type: String,
        enum: ['Computers', 'Mobiles', 'Cameras', 'Men"s', 'Women"s', 'Kids', 'Accessories', 'Decor', 'Kitchen', 'Bedding', 'Skincare', 'Haircare', 'Perfumes', 'Books', 'Movies', 'Music', 'Equipment', 'Activewear', 'Camping', 'Kids Toys', 'Board Games', 'Video Games', 'Vitamins', 'Fitness Equipment', 'Monitoring Devices', 'Car Accessories', 'Maintenance', 'Motorcycle Gear', 'Rings', 'Watches', 'Necklaces', 'Stationery', 'Furniture', 'Electronics', 'Groceries', ' Snacks', 'Beverages', 'Pet Food', 'Accessories', 'Care products', 'Handmade', 'Customized']
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    rating: {
        type: String,
        default: 0
    },
    queries:[{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],
    seller:{
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    }
})

productSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            id: {
                $in: doc.reviews
            }
        })
    }

})

productSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Question.deleteMany({
            id: {
                $in: doc.questions
            }
        })
    }

})





const Product = mongoose.model('Product', productSchema);

module.exports = Product