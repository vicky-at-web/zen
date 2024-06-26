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
        enum: [
            "electronics",
            "fashion",
            "home_kitchen",
            "books",
            "beauty_personal_care",
            "health_wellness",
            "sports_outdoors",
            "toys_games",
            "automotive",
            "grocery_gourmet_food",
            "baby_products",
            "pet_supplies",
            "industrial_scientific",
            "office_products",
            "tools_home_improvement",
            "musical_instruments",
            "software",
            "arts_crafts_sewing",
            "movies_tv",
            "video_games"
        ]
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
    },
    additionalInfos: {
        type: Schema.Types.Mixed
    }
})

// productSchema.pre('save', function (next) {
//         this.details = this.details || {};
//         const objName = `${this.category.replace(/\s+/g, '').toLowerCase()}Details`;
//         this.details = details[`${objName.replace(/\\s+/g, '')}Schema`];
//     next();
// });

productSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const reviewIds = Array.isArray(doc.reviews) ? doc.reviews : [doc.reviews];
        const questionIds = Array.isArray(doc.questions) ? doc.questions : [doc.questions];

        await Review.deleteMany({ id: { $in: reviewIds } });
        await Question.deleteMany({ id: { $in: questionIds } });
    }
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product