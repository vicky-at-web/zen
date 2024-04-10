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
        type: Date,
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
            type: Date
        }
    }]
});


const Question = mongoose.model('Question', questionSchema)

module.exports = Question;

