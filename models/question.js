const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answers: [{
        answer: {
            type: String,
            required: true
        },
    }]
});


const Question = mongoose.model('Question', questionSchema)

module.exports = Question;

