const customError = require('../../error/CustomAPIError');
const { StatusCodes } = require('http-status-codes');

const createQuizCheck = async (req, res, next) => {
    const { quizType } = req.body;
    if (quizType === 'MultipleChoiceQuiz') {
        const { question, level, options, answer } = req.body.multipleQuiz;
        if (!question || !level || !options || !answer) {
            throw new customError(
                'Please provide all the required fields',
                StatusCodes.BAD_REQUEST
            );
        }
        next();
    } else if (quizType === 'FillQuiz') {
        const { sentence, level, values } = req.body.fillQuiz;
        let valueCount = 0;
        if (!sentence || !level || !values) {
            throw new customError(
                'Please provide all the required fields',
                StatusCodes.BAD_REQUEST
            );
        }
        const hasMissingPlaceholder = values.some((value) => {
            return !sentence.includes(value.placeholder) || !value.value;
        });
        if (hasMissingPlaceholder) {
            throw new customError(
                'Please provide placeholder and value for every field',
                400
            );
        }

        // Only add four value in the fill in the blank
        values.forEach((value) => {
            valueCount += 1;
            if (value.mistakes) {
                valueCount += value.mistakes.length;
            }
        });
        if (valueCount > 4) {
            throw new customError(
                'Please provide only four values',
                StatusCodes.BAD_REQUEST
            );
        }

        next();
    }
};

module.exports = { createQuizCheck };
