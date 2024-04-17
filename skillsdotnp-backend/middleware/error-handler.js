const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong, please try again later',
    };
    console.log("Error:",err)
    if (err.name === 'ValidationError') {
        return res.status(StatusCodes.BAD_REQUEST).json({
            validationErrors: Object.keys(err.errors).map(path => {
                return { path, message: err.errors[path].message };
            }),
        })
    }
    if (err.code && err.code === 11000) {
        customError.message = `Duplicate value entered for ${Object.keys(
            err.keyValue
        )} field, please choose another value`;
        customError.statusCode = 400;
    }
    if (err.name === 'CastError') {
        customError.message = `No item found with id : ${err.value}`;
        customError.statusCode = 404;
    }
    return res
        .status(customError.statusCode)
        .json({ msg: customError.message });
};

module.exports = errorHandlerMiddleware;
