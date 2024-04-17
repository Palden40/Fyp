const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
    {
        no: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        code: [
            {
                language: {
                    type: String,
                    required: true,
                },
                code: {
                    type: String,
                    required: true,
                },
            },
        ],

        category: {
            type: String,
            required: true,
        },
        explanation: {
            type: String,
            required: true,
        },
        flowchart: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Content', contentSchema);
