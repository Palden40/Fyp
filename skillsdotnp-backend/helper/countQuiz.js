const countQuizzes = (chapter) => {
    let totalQuizzes = 0;
    for (const content of chapter.content) {
        totalQuizzes += content.quizzes.length;
    }
    return totalQuizzes;
};

module.exports = countQuizzes;
