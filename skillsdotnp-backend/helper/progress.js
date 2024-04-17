const { StatusCodes } = require('http-status-codes');
const customError = require('../error/CustomAPIError');
const EnrolledModel = require('../models/entities/enrolledUser.model');

const checkEnrollment = async (userId, courseId) => {
    const enrolled = await EnrolledModel.findOne({
        userId,
        courseId,
    });
    if (!enrolled) {
        throw new customError(
            'You have not enrolled in this course',
            StatusCodes.NOT_FOUND
        );
    }
    return enrolled;
};

const findOrCreateChapterProgress = async (enrolled, chapterId) => {
    let currentChapter = enrolled.chapterProgress.find(
        (chapter) => chapter.chapterId.toString() === chapterId
    );
    if (!currentChapter) {
        // Create a new chapter in the enrolled
        currentChapter = { chapterId, progress: 0 };
        enrolled.chapterProgress.push(currentChapter);
        await enrolled.save();
    }
    return currentChapter;
};

const updateQuizProgress = async (
    enrolled,
    quizId,
    chapterId,
    isCorrect,
    totalQuizzes
) => {
    const quizChapter = enrolled.quizProgress.find(
        (chapter) => chapter.chapterId.toString() === chapterId
    );

    if (quizChapter) {
        const quiz = quizChapter.completedQuiz.find(
            (quiz) => quiz.quizId.toString() === quizId
        );
        if (quiz) {
            // If the quiz has already been marked as correct, don't increase the count again
            if (!quiz.isCorrect && isCorrect) {
                quiz.isCompleted = true;
                quiz.isCorrect = isCorrect;
                quizChapter.CorrectQuizzes += 1;
            } else if (!quiz.isCorrect && !isCorrect) {
                quiz.isCompleted = true;
                quiz.isCorrect = isCorrect;
            }
        } else {
            quizChapter.completedQuiz.push({
                quizId,
                isCompleted: true,
                isCorrect,
            });
            if (isCorrect) {
                quizChapter.CorrectQuizzes += 1;
            }
        }
        quizChapter.TotalQuiz = totalQuizzes;
    } else {
        enrolled.quizProgress.push({
            chapterId,
            completedQuiz: [
                {
                    quizId,
                    isCompleted: true,
                    isCorrect,
                },
            ],
            CorrectQuizzes: isCorrect ? 1 : 0,
            TotalQuiz: totalQuizzes,
        });
    }
    await enrolled.save();
};

module.exports = {
    checkEnrollment,
    findOrCreateChapterProgress,
    updateQuizProgress,
};
