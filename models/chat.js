const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller' // Reference to the Seller model
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer' // Reference to the Customer model
  },
  messages: [{
    content: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      enum: ['seller', 'customer'], // Sender can be either 'seller' or 'customer'
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: { 
        type: Boolean, default: false 
    }
  }]
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
