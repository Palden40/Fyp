const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
    },
    role: {
        type: String,
        enum: ['super_admin', 'teacher', 'user'],
        default: 'user',
    },
    profilePicture: String,
    username: String,
    refreshToken: String,
    resetPin: String,
    resetPinExpiration: Date,
});

module.exports = mongoose.model('User', userSchema);
