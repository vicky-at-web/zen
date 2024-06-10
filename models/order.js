const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    orderId: {
        type: String
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    orderFrom: {
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    },
    orderTo: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    billingAddress:{
        street: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },
        pincode: {
            type: String,
        },
    }
})

orderSchema.pre('save', function (next) {
    this.orderId = Math.floor(Math.random() * 9999999999);
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;