const mongoose = require('mongoose');
const { Schema } = mongoose;
const Question = require('./question');
const Review = require('./review');
const details = require('./details');



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
    searchTerm: [{
        type: String,
    }],
    price: {
        type: Number
    },
    category: {
        type: String,
        enum: ['Computer', 'Mobile', 'Camera', 'Mens', 'Womens', 'Kids', 'Accessories', 'Decor', 'Kitchen', 'Bedding', 'Skincare', 'Haircare', 'Perfumes', 'Books', 'Movies', 'Music', 'Equipment', 'Activewear', 'Camping', 'Kids Toys', 'Board Games', 'VideoGames', 'Medicines', 'FitnessEquipment', 'MonitoringDevices', 'CarAccessories', 'Maintenance', 'MotorcycleGear', 'Ornaments', 'Stationery', 'Furniture', 'Electronics', 'Groceries', ' Snacks', 'Beverages', 'PetFood', 'Careproducts', 'Handmade']
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    rating: {
        type: String,
        default: 0
    },
    queries: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],

    brand: {
        type: String,
    },
    headers: {
        type: String,
    },
    launchDate: {
        type: Date
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    },
    details: {
        type: Schema.Types.Mixed
    }
})

productSchema.pre('save', function (next) {
    this.details = this.details || {};
    let objName = `${this.category.toLowerCase()}Details`;
    if (!this.details[objName]) {
        this.details[objName] = details[objName + 'Schema'];
    }
    next();
});

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