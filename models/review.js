const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    refPath: 'authorType' // Dynamic reference based on the authorType field
  },
  authorType: {
    type: String,
    enum: ['seller', 'customer'], // Enumerate possible author types
    required: true
  },
  date: {
    type: Date,
  }
})



const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;