require('dotenv').config();

exports.ACCESS_SECRET = process.env.ACCESS_SECRET;
exports.MONGOD_URI = process.env.MONGOD_URI;
exports.HOST_URI = process.env.HOST_URI || 'http://localhost:8000';