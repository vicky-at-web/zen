

const mongoose = require('mongoose');
const Product = require('./product');
const passportLocalMongoose = require('passport-local-mongoose')


const { Schema } = mongoose;

const sellerSchema = new Schema({
    bussinessName:{
        type: String,
        default: 'ABC shop'
    },
    address: {
        type: String,
        default: '123, ABC street, Auckland, NZ'
    },
    contact: {
        type: Number,
        default: 1234567890
    },
    email: {
        type: String,
        required: true,
    },
    role:{
        type: String,
    },
    imageUrl: {
        type: String,
        default: 'https://source.unsplash.com/collection/483251'
    },
    rating: {
        type: String,
        default: 0
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
   
    // sreviews: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'sReview'
    // }]

})

sellerSchema.post('findOneAndDelete', async function (seller) {
    if (seller.products.length) {
        const res = await Product.deleteMany({ _id: { $in: seller.products } })
        console.log(res)
    }

})

// sellerSchema.post('findOneAndDelete', async function (doc) {
//     if (doc) {
//         await sReview.deleteMany({
//             id: {
//                 $in: doc.sreviews
//             }
//         })
//     }

// })

sellerSchema.plugin(passportLocalMongoose);

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
