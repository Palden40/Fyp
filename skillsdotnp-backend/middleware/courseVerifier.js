const courseModel = require('../models/entities/course.model');

module.exports = async (req, res, next) => {
    console.log(req.params.courseid);
    if (!(await courseModel.findById(req.params.courseid))) {
        return res.json({
            error: 'course by this id does not exist',
        });
    }

    req.params.courseId = req.params.id;
    next();
};
