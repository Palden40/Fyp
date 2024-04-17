const userServices = require('../controllers/Auth/auth.controller');
const userRouter = require('express').Router();

const validationMiddleware = require('../middleware/validation');
const { authSchema } = require('../zod_schemas/auth.validateSchema');
const User = require('../models/user.model');
const {
    verifyToken,
    tokenExtractor,
    teacherScope,
} = require('../middleware/tokenAuth');

userRouter.post(
    '/user/register',
    validationMiddleware(authSchema),
    userServices.register
);
userRouter.post(
    '/user/login',
    validationMiddleware(authSchema),
    userServices.login
);

userRouter.get(
    '/currentUser',
    tokenExtractor,
    verifyToken,
    async (req, res) => {
        const { id: userId } = req.user;
        console.log("Req.user: ",req.user);
        const user = await User.findById(userId);
        console.log(user);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json(user);
    }
);

// Get Single User with ID for admin only
userRouter.get('/user/:id', tokenExtractor, teacherScope, async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json(user);
});

userRouter.delete(
    "/user/deleteAccount",
    tokenExtractor,
    verifyToken,
    userServices.deleteUserAccount
);

userRouter.patch(
    '/profile',
    tokenExtractor,
    verifyToken,
    userServices.updateProfile
);

module.exports = userRouter;
