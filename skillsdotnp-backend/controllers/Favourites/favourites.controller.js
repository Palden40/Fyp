const favourites = require('../../models/favourites.model');
const customError = require('../../error/CustomAPIError');
const { StatusCodes } = require('http-status-codes');

const AddToFavourites = async (req, res) => {
    const { id: userId } = req.user;
    const { course, question } = req.body;
    let favourite;
    try {
        // Checking if the collection is exist for that user in database
        const checkUserFavourites = await favourites.findOne({ userId });
        if (!checkUserFavourites) {
            favourite = await favourites.create({ userId, ...req.body });
        }
        if (checkUserFavourites) {
            if (course) {
                checkUserFavourites.course.push(course);
                await checkUserFavourites.save();
            }
            if (question) {
                checkUserFavourites.question.push(question);
                await checkUserFavourites.save();
            }
            res.status(StatusCodes.CREATED).json({
                msg: 'Added to favourite',
                checkUserFavourites,
            });
        }
        res.status(StatusCodes.CREATED).json({
            msg: 'Added to favourite',
            favourite,
        });
    } catch (error) {
        throw new customError(error.message, StatusCodes.BAD_REQUEST);
    }
};

const RemoveFromFavourites = async (req, res) => {
    const { course, question } = req.body;
    const { id: userId } = req.user;
    try {
        const userFavourites = await favourites.findOne({ userId });
        console.log(userFavourites);
        if (!userFavourites) {
            throw new customError(
                'No favourites found for this user',
                StatusCodes.NOT_FOUND
            );
        }
        if (course) {
            const remove = userFavourites.course.pull(course);
            await userFavourites.save();
        }
        if (question) {
            const remove = userFavourites.question.pull(question);
            await userFavourites.save();
        }
        res.status(StatusCodes.OK).json({
            msg: 'Removed from favourites',
        });
    } catch (error) {
        if (error instanceof customError) {
            throw new customError(error.message, error.statusCode);
        }
        throw new customError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

const getUserFavourites = async (req, res) => {
    const { id: userId } = req.user;
    const UserFavourites = await favourites.findOne({ userId });
    if (!UserFavourites) {
        throw new customError(
            'No favourites found for this user',
            StatusCodes.NOT_FOUND
        );
    }
    await UserFavourites.populate('course');
    await UserFavourites.populate('question');
    res.status(StatusCodes.OK).json({
        msg: 'Fetched successfully',
        UserFavourites,
    });
};

module.exports = { AddToFavourites, RemoveFromFavourites, getUserFavourites };
