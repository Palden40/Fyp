const { StatusCodes } = require('http-status-codes');
const customError = require('../error/CustomAPIError');

const validateProfile = (req, res, next) => {
    const {
        first_name,
        last_name,
        phone_number,
        country,
        Address,
        status,
        date_of_birth,
        gender,
        profile_picture,
        bio,
        Socials,
        tier_id,
    } = req.body;

    // Perform validation checks on the required fields
    if (req.method === 'POST') {
        if (
            !first_name ||
            !last_name ||
            !phone_number ||
            !country ||
            !Address ||
            !status ||
            !date_of_birth ||
            !gender ||
            !tier_id
        ) {
            throw new customError(
                'Missing required fields',
                StatusCodes.BAD_REQUEST
            );
        }
    }

    if (phone_number && phone_number.length !== 10) {
        throw new customError(
            'Phone number must contain 10 digits',
            StatusCodes.BAD_REQUEST
        );
    }

    // check if the tier_id is one of the allowed values
    if (tier_id && !['1', '2', '3'].includes(tier_id)) {
        throw new customError('Invalid tier_id', StatusCodes.BAD_REQUEST);
    }

    // If all checks pass, move to the next middleware
    next();
};

module.exports = validateProfile;
