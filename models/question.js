const mongoose = require('mongoose');
const { Schema } = mongoose;



const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    date: {
        type: Date,
    },
    answers: [{
        answer: {
            type: String,
            required: true
        },
        tags: [{
            type: String
        }],
        author: {
            customer: {
                type: Schema.Types.ObjectId,
                ref: 'Customer'
            },
            seller: {
                type: Schema.Types.ObjectId,
                ref: 'Seller'
            }
        },
        date: {
            type: Date
        }
    }]
});




const Question = mongoose.model('Question', questionSchema)

module.exports = Question;

