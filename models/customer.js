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
        default: 'https://i.stack.imgur.com/l60Hf.png',
    }
})

customerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Customer', customerSchema)