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
        default: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
    }
})







customerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Customer', customerSchema)