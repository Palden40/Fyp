const { StatusCodes } = require('http-status-codes');
const Profile = require('../../models/profile.model');
const CustomAPIError = require('../../error/CustomAPIError');

const createProfile = async (req, res) => {
    try {
        const existingProfile = await Profile.findOne({ user_id: req.user.id });
        if (existingProfile) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                msg: 'Profile already exists for this user',
            });
        }
        if (req.body.email) {
            throw new CustomAPIError(
                'Email cannot be change',
                StatusCodes.FORBIDDEN
            );
        }
        const data = new Profile({
            ...req.body,
            user_id: req.user.id,
        });
        await data.save();
        res.status(StatusCodes.OK).json({
            msg: 'Profile successfully created!!',
            data,
        });
    } catch (err) {
        throw new CustomAPIError(
            'Server error',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
};

const updateProfile = async (req, res) => {
    const { id: userId } = req.user;
    if (req.body.email) {
        throw new CustomAPIError(
            "Email can't be change",
            StatusCodes.FORBIDDEN
        );
    }
    const profile = await Profile.findOneAndUpdate(
        { user_id: userId },
        { ...req.body },
        {
            new: true,
            runValidators: true,
        }
    );
    if (!profile) {
        throw new CustomAPIError(`No profile with user id : ${userId}`, 404);
    }
    res.status(StatusCodes.OK).json({
        msg: 'Profile updated successfully',
        profile,
    });
};

const deleteProfile = async (req, res) => {
    const { id: userId } = req.user;
    const profile = await Profile.findOneAndDelete({ user_id: userId });
    if (!profile) {
        throw new CustomAPIError(`No profile with user id : ${userId}`, 404);
    }
    res.status(StatusCodes.OK).json({
        msg: 'Profile deleted successfully',
        profile,
    });
};

const getProfile = async (req, res) => {
    const { id: userId } = req.user;
    const profile = await Profile.findOne({ user_id: userId });
    if (!profile) {
        throw new CustomAPIError(`No profile with user id : ${userId}`, 404);
    }
    res.status(StatusCodes.OK).json({ profile });
};

const getAllProfiles = async (req, res) => {
    const profiles = await Profile.find({});
    if (profiles.length === 0) {
        throw new CustomAPIError('No profiles found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({ profiles });
};

module.exports = {
    createProfile,
    updateProfile,
    deleteProfile,
    getProfile,
    getAllProfiles,
};
