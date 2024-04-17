const mainRouter = require('express').Router();

const adminRouter = require('./teacher.routes');
const userRouter = require('./users.routes');
const commonRouter = require('./common.routes');
const courseRouter = require('./course.routes');
const coursesCategoryRouter = require('./courseCategory.routes');

mainRouter
    .use(adminRouter)
    .use(userRouter)
    .use(commonRouter)
    .use(courseRouter)
    .use(coursesCategoryRouter);

module.exports = mainRouter;
