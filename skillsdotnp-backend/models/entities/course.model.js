const {
    Schema,
    model,
    Types: { ObjectId },
} = require('mongoose');
const mongoose = require('mongoose');
const schemaJSONParser = require('../../Utils/schemaJSONParser');
const foreign_key = mongoose.Schema.Types.ObjectId;
const requiredString = { type: String, required: true };

//main course schema containing all child schemas
const courseSchema = new Schema(
    {
        category: { type: String, required: false },
        language: { type: String, required: false },
        courseName: { type: String, required: false },
        tagLine: { type: String, required: false },
        description: { type: String },
        price: { type: Number, required: false },
        banner: { type: String, required: false },
        bannerImageUrl: String,
        isFeatured: { type: Boolean, required: false, default: false },
        content: [
            {
                content_type: String,
                title: String,
                data: mongoose.Schema.Types.Mixed,
            },
        ],
        ReviewId: [
            {
                type: foreign_key,
                ref: 'review',
            },
        ],
        AverageReview: Number,
        teacherId: {
            type: foreign_key,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

schemaJSONParser(courseSchema);

module.exports = model('course', courseSchema);
