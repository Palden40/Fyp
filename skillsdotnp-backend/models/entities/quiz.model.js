const {
    Schema,
    Types: { ObjectId },
    model,
} = require('mongoose');
const schemaJSONParser = require('../../Utils/schemaJSONParser');

const questionSchema = new Schema({
    title: String,
    questionType: String,
    options: [String],
    answer: String,
    quizId: { type: ObjectId, required: true },
});

const quizSchema = new Schema({
    quizTitle: { type: String, required: true },
    questions: [{ type: ObjectId, ref: 'question' }],
    lessonId: { type: ObjectId, required: true },
    courseId: { type: ObjectId, required: true },
});

schemaJSONParser(quizSchema, questionSchema);

module.exports = {
    quizModel: new model('courseQuiz', quizSchema),
    questionModel: new model('quizQuestion', questionSchema),
};
