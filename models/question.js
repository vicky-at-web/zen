const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    date:{
        type: String,
    },
    answers: [{
        answer: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'Customer'
        }, 
        date:{
            type: String
        }
    }]
});


const Question = mongoose.model('Question', questionSchema)

module.exports = Question;

