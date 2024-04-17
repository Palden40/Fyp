const courseQuestion = require('../../models/entities/question.model.js');

const createCourseQuestion = async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    try {
        if (!body) {
            return res.status(400).json({
                message: 'Content cannot be empty!',
            });
        }

        const { question, solution } = body;
        if (!question || !solution) {
            return res.status(400).json({
                message: 'Question and solution cannot be empty!',
            });
        }

        const payload = { question, solution, courseId: id };
        const newQuestion = await courseQuestion.create(payload);
        if (!newQuestion) throw new Error('question creeation failed');

        return res
            .status(201)
            .json({ success: true, message: 'new question added' });
    } catch (err) {
        next(err);
    }
};

const getCourseQuestion = async (req, res, next) => {
    const { id } = req.params;
    try {
        const questions = await courseQuestion.find({ courseId: id });
        return res.json({ questions });
    } catch (err) {
        next(err);
    }
};

const updateCourseQuestion = async (req, res, next) => {
    const { questionId } = req.params;
    const { body } = req;
    try {
        //validate request
        if (!body) {
            return res.status(400).json({
                message: 'Content cannot be empty!',
            });
        }

        const courseQuestions = await courseQuestion.findByIdAndUpdate(
            questionId,
            { ...body },
            { new: true }
        );
        return res.json(courseQuestions);
    } catch (err) {
        next(err);
    }
};

const deleteCourseQuestion = async (req, res, next) => {
    try {
        const { questionId } = req.params;
        await courseQuestion.findByIdAndDelete(questionId);

        return res.json({ message: 'question deleted!' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createCourseQuestion,
    getCourseQuestion,
    updateCourseQuestion,
    deleteCourseQuestion,
};
