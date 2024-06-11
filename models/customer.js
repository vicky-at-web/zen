const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
    },
    role: {
        type: String,
        default: 'customer'
    },
    cart: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    notifications: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Notification'
        }
    ],
    favourites: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    profilePic: {
        type: String,
        default: 'https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg',
    },
    address: {
        street: {
            type: String,
            default: '123 abc street'
        },
        city: {
            type: String,
            default: 'NY '
        },
        state: {
            type: String,
            default: 'Washington'
        },
        country: {
            type: String,
            default: 'USA'
        },
        pincode: {
            type: String,
            default: '53821'
        },
    },
    points: {
        type: String,
        default: 0
    },
    mobile: {
        type: String,
        default: '1234567890'
    },
    dateofjoin: {
        type: String
    },
})



customerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Customer', customerSchema)