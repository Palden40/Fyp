const jwt = require('jsonwebtoken');
const { ACCESS_SECRET } = require('../main.config');

const createToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, ACCESS_SECRET);
};

module.exports = { createToken };
