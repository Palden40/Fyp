const { StatusCodes } = require('http-status-codes');
const { fromZodError } = require('zod-validation-error');

const validationMiddleware = (schema) => (req, res, next) => {
    try {
        const parsedData = schema.parse({
            body: req.body,
        });
        const { body } = parsedData;

        req.body = body;
        next();
    } catch (error) {
        const validationError = fromZodError(error);
        const errorMessages = validationError.details.map(
            (detail) => detail.message
        );
        res.status(StatusCodes.BAD_REQUEST).json(errorMessages);
    }
};

module.exports = validationMiddleware;
