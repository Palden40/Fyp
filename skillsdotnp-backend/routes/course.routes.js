const express = require('express');
const courseRouter = express.Router();
const courseController = require('../controllers/Course/course.controller');

const {
    verifyToken,
    tokenExtractor,
    teacherScope,
} = require('../middleware/tokenAuth');

courseRouter
    .route('/course')
    .get(courseController.getCourse)
    .post(
        tokenExtractor,
        verifyToken,
        teacherScope,
        courseController.createCourse
    );

courseRouter.get(
    '/course/verifyEnrollment',
    tokenExtractor,
    verifyToken,
    courseController.verifyCourseEnrollment
);

courseRouter
    .route('/course/:id')
    .get(courseController.getCourseById)
    .put(
        tokenExtractor,
        verifyToken,
        teacherScope,
        courseController.updateCourse
    )
    .delete(
        tokenExtractor,
        verifyToken,
        teacherScope,
        courseController.deleteCourse
    );

courseRouter.post(
    '/course/:id/content',
    tokenExtractor,
    verifyToken,
    teacherScope,
    courseController.addCourseContent
);
courseRouter.post(
    '/course/:id/contents',
    tokenExtractor,
    verifyToken,
    teacherScope,
    courseController.addCourseContents
);

//enroll User
courseRouter
    .route('/course/:id/enroll')
    .post(tokenExtractor, verifyToken, courseController.enrollCourse)
    .delete(tokenExtractor, verifyToken, courseController.unenrollCourse)
    .get(tokenExtractor, teacherScope, courseController.getEnrollUsers);

courseRouter.post(
    '/course/:id/initialEnrollment',
    tokenExtractor,
    verifyToken,
    courseController.initiateCourseEnrollment
);

courseRouter
    .route('/enroll/user/courses')
    .get(tokenExtractor, verifyToken, courseController.getEnrollUser);

courseRouter
    .route('/course/:id/enroll/user/check')
    .get(tokenExtractor, verifyToken, courseController.checkEnrollUserByCourse);

courseRouter.post(
    '/course/:id/content/:contentId/complete',
    tokenExtractor,
    verifyToken,
    courseController.registerCompleted
);

module.exports = courseRouter;
