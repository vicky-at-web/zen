
const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    header: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    productName: String,
    productId: String,
    productSeller: String

});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
