const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    pidx: { type: String, required: true},
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    initatedDate: { type: Date, default: Date.now },
    paymentDate: { type: Date },
    paymentUrl: { type: String, required: true },
    status: { type: String, default: 'pending' },
});

module.exports = mongoose.model('Payment', paymentSchema);
