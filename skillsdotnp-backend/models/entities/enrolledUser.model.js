const mongoose = require('mongoose');

const enrolledUserSchema = mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    enrolled_Date: String,
    completed_date: String,
    isCompleted: { type: Boolean, default: false },
    progress: {
        lastIndex: {
            type: String,
        },
        completedIndexes: {
            type: [String],
            default: [],
        },
        currentIndex: {
            type: String,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
});

module.exports = mongoose.model('EnrolledUser', enrolledUserSchema);
