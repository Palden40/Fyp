const bcrypt = require('bcryptjs');
const userModel = require('../../models/user.model');
const jwt = require("jsonwebtoken");
const { ACCESS_SECRET } = require("../../main.config");
const initSuperAdmin = async () => {
    const superAdmin = await userModel.findOne({ role: 'super_admin' });
    if (superAdmin) {
        await userModel.deleteMany({ role: 'super_admin' });
    }
    const password = process.env.SUPER_ADMIN_PASSWORD;
    const email = process.env.SUPER_ADMIN_EMAIL;

    if (!email || !password) {
        throw new Error('Please provide SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in the .env file!');
    }

    const passHash = await bcrypt.hash(password, 10);
    await new userModel({
        email,
        passwordHash: passHash,
        role: 'super_admin',
    }).save();
}

const loginSuperAdmin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email && !password) {
        return res.status(403).json({
            message: 'Invalid credentials!',
        });
    }

    if (email.toLowerCase().trim() !== process.env.SUPER_ADMIN_EMAIL.toLowerCase().trim()) {
        return res.status(403).json({
            message: 'Invalid superadmin email!',
        });
    }
    if (password !== process.env.SUPER_ADMIN_PASSWORD) {
        return res.status(403).json({
            message: 'Invalid superadmin password!',
        });
    }

    const token = jwt.sign(
        {
            id: '0',
            role: 'super_admin',
        },
        ACCESS_SECRET
    );

    return res.json({
        message: 'Logged In successfully!',
        token,
    });
};

module.exports = { loginSuperAdmin, initSuperAdmin };
