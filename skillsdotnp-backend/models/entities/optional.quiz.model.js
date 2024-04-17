/**
 * This model is for fill in the blank quiz
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const valueSchema = new Schema(
    {
        placeholder: String,
        value: String,
        mistakes: [String],
    },
    { _id: false }
);

const FillQuizSchema = new Schema({
    sentence: String,
    values: [valueSchema],
});

module.exports = mongoose.model('FillQuiz', FillQuizSchema);
