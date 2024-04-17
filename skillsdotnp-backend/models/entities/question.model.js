const {
    Schema,
    model,
    Types: { ObjectId },
} = require('mongoose');

/**
 * course/Question Schema
 */
const courseQuestionSchema = new Schema({
    question: String,
    solution: String,
    courseId: { type: ObjectId, ref: 'course' },
});

courseQuestionModel = model('courseQuestion', courseQuestionSchema);
module.exports = courseQuestionModel;
