const userModel = require('../../models/user.model');
const enrolledCourse = require('../../models/entities/enrolledUser.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ACCESS_SECRET } = require('../../main.config');
const config = require('../../main.config');
const customError = require('../../error/CustomAPIError');
const { StatusCodes } = require('http-status-codes');
const courseModel = require('../../models/entities/course.model');

const register = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username) {
        throw new customError('Username is required', StatusCodes.BAD_REQUEST);
    }

    const userFound = await userModel.findOne({ email });
    if (userFound) {
        throw new customError('User already exist', StatusCodes.FORBIDDEN);
    }

    const hash = await bcrypt.hash(password, 10);
    const savedUser = await new userModel({
        username,
        email,
        passwordHash: hash,
    }).save();

    return res.status(201).json({
        message: 'User created successfully!',
        user: savedUser,
    });
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    if (!email && !password) {
        return res.status(403).json({
            message: 'Invalid credentials!',
        });
    }

    userModel
        .findOne({ email })
        .then((userFound) => {
            if (!userFound) {
                return res.status(422).json({
                    message: 'User not found!',
                });
            }

            bcrypt
                .compare(password, userFound.passwordHash)
                .then((compare) => {
                    if (!compare) {
                        return res.status(403).json({
                            message: 'Invalid Password!',
                        });
                    }

                    const token = jwt.sign(
                        {
                            id: userFound._id,
                            role: 'user',
                        },
                        ACCESS_SECRET
                    );
                    return res.json({
                        message: 'Logged In successfully!',
                        token,
                    });
                })
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
};

const deleteUserAccount = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (user.role === "teacher") {
            courseModel.deleteMany({ teacherId: user._id.toString() });
        }

        await userModel.deleteMany({ email: user.email });
        if (user.role === "user") {
            await enrolledCourse.deleteMany({ userId: user._id });
        }
        res.status(StatusCodes.OK).json({
            message: 'Successfully deleted user data.',
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: 'Some error deleting',
            error,
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                msg: 'User not found',
            });
        }
        const {username, profilePicture} = req.body;
        const updateduser = await userModel.findByIdAndUpdate(req.user.id, {
            username,
            profilePicture,
        }, { new: true });
        return res.status(StatusCodes.OK).json({
            message: 'User updated successfully',
            updateduser,
        });
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: 'Some error updating',
            error,
        });
    }

}

module.exports = {
    login,
    register,
    deleteUserAccount,
    updateProfile,
};
