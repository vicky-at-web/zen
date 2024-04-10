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
      required: true  // Assuming you want the content to be required
    },
    sender: {
      type: String,
      required: true  // Assuming you want the sender to be required
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isread:{
      type: Boolean,
      default: false
    }
  }]
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;

