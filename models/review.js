const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema ({
      body:{
        type: String,
        required: true,
      },
      rating:{
        type: String,
        required: true
      },
      author:{
        type: Schema.Types.ObjectId,
        ref: 'Customer'
      }
})



const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;