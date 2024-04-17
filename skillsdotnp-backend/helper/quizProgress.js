const multipleChoice = require('../models/entities/multipleChoiceQuiz.model');
const FillBlank = require('../models/entities/optional.quiz.model');
const { StatusCodes } = require('http-status-codes');
const customError = require('../error/CustomAPIError');
// const custom = require('../error');
const { updateQuizProgress } = require('./progress');

const handleMultipleChoiceQuiz = async (
    enrolled,
    quizId,
    chapterId,
    answer,
    totalQuizzes,
    quiz
) => {
    const multipleQuiz = await multipleChoice.findById(
        quiz.MultipleChoiceQuizId
    );
    if (!multipleQuiz) {
        throw new customError('Multiple Quiz not found', StatusCodes.NOT_FOUND);
    }

    if (multipleQuiz.answer === answer) {
        await updateQuizProgress(
            enrolled,
            quizId,
            chapterId,
            true,
            totalQuizzes
        );
        return { success: true, message: 'Correct answer' };
    } else {
        await updateQuizProgress(
            enrolled,
            quizId,
            chapterId,
            false,
            totalQuizzes
        );
        return { success: false, message: 'Wrong answer' };
    }
};

const handleFillQuiz = async (
    enrolled,
    quizId,
    chapterId,
    values,
    totalQuizzes,
    quiz
) => {
    const fillQuiz = await FillBlank.findById(quiz.FillQuizId);

    if (!fillQuiz) {
        throw new customError('Fill Quiz not found', StatusCodes.NOT_FOUND);
    }

    const expectedValues = fillQuiz.values.reduce((map, value) => {
        map.set(value.placeholder, value.value);
        return map;
    }, new Map());

    const incorrectValues = values.filter((userValue) => {
        const expectedValue = expectedValues.get(userValue.placeholder);
        return expectedValue !== userValue.value;
    });

    if (incorrectValues.length === 0) {
        await updateQuizProgress(
            enrolled,
            quizId,
            chapterId,
            true,
            totalQuizzes
        );
        return { success: true, message: 'Correct answer' };
    } else {
        await updateQuizProgress(
            enrolled,
            quizId,
            chapterId,
            false,
            totalQuizzes
        );

        const incorrectPlaceholders = incorrectValues.map(
            (value) => value.placeholder
        );
        throw new customError(
            `Incorrect placeholders: [${incorrectPlaceholders.join(', ')}]`,
            StatusCodes.BAD_REQUEST
        );
    }
};

module.exports = {
    handleFillQuiz,
    handleMultipleChoiceQuiz,
};
