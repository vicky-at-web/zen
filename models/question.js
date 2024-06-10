const mongoose = require('mongoose');
const { Schema } = mongoose;



const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    tags:[{
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
        tags:[{
            type: String
        }],
        author: {
           username: String,
           profile: String,
        },
        authorRole: {
            type: String,
            enum: ['customer', 'seller'],
            required: true
        },
        date: {
            type: Date
        }
    }]
});




const Question = mongoose.model('Question', questionSchema)

module.exports = Question;

