const teacherRouter = require('express').Router();
const teacherServices = require('../controllers/Teacher/teacher');
const {
    tokenExtractor,
    verifyToken,
    superAdminScope,
} = require('../middleware/tokenAuth');
const validationMiddleware = require('../middleware/validation');
const { authSchema } = require('../zod_schemas/auth.validateSchema');
const {
    loginSuperAdmin,
} = require('../controllers/Auth/admin.auth.controller');

teacherRouter.post(
    '/superAdmin/login',
    validationMiddleware(authSchema),
    loginSuperAdmin
);

teacherRouter.post(
    '/admin/login',
    validationMiddleware(authSchema),
    teacherServices.login
);
teacherRouter.post(
    '/admin/register',
    validationMiddleware(authSchema),
    teacherServices.register
);

teacherRouter.get(
    '/teachers',
    // tokenExtractor,
    // verifyToken,
    // superAdminScope,
    teacherServices.getTeachers
);

teacherRouter.delete(
    '/teacher/:id',
    tokenExtractor,
    verifyToken,
    superAdminScope,
    teacherServices.deleteTeacher
);

module.exports = teacherRouter;
