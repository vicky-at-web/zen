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
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    favourites: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    profilePic: {
        type: String,
        default: 'https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg',
    }
})







customerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Customer', customerSchema)