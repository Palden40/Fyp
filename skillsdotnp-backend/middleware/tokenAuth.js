const jwt = require('jsonwebtoken');
const { ACCESS_SECRET } = require('../main.config');

const tokenExtractor = (req, res, next) => {
    const token = req.get('authorization');

    if (!token) {
        return res.status(498).json({
            message: 'token not found!',
        });
    }

    req.token = token.substring(7);
    next();
};

const teacherScope = (req, res, next) => {
    const { role } = jwt.verify(req.token, ACCESS_SECRET);

    if (role !== 'teacher' && role !== 'admin') {
        return res.status(401).json({
            message: 'Insufficient scope!',
        });
    }
    next();
};

const superAdminScope = (req, res, next) => {
    const { role } = jwt.verify(req.token, ACCESS_SECRET);

    if (role !== 'super_admin') {
        return res.status(401).json({
            message: 'Insufficient scope!',
        });
    }
    next();
}

const verifyToken = (req, res, next) => {
    let id,role;
    try {
        let verified_payload = jwt.verify(req.token, ACCESS_SECRET);
        console.log(verified_payload);
        id = verified_payload.id;
        role = verified_payload.role;
    } catch (e) {
        // console.log(e)
        return res.status(401).json({
            message: 'Invalid Token!',
        });
    }
    if (!id) {
        console.log("Invalid token, No id.")
        return res.status(401).json({
            message: 'Invalid Token!',
        });
    }
    req.user = { id, role };
    next();
};

module.exports = { tokenExtractor, teacherScope, verifyToken, superAdminScope };
