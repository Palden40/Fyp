const mongoose = require('mongoose');
const schemaJSONParser = require('../../Utils/schemaJSONParser');

const courseDescriptionSchema = new mongoose.Schema({
    description: { type: String, required: true },
    requirement: { type: String, required: true },
    skillsGained: [{ type: String }],
    duration: String,
    difficulty: String,
    totalLessons: [{ type: String }],
    courseId: { type: mongoose.Types.ObjectId, ref: 'course' },
});

schemaJSONParser(courseDescriptionSchema);

module.exports = mongoose.model('courseDescription', courseDescriptionSchema);
