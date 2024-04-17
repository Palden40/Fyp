const jwt = require('jsonwebtoken');
const { ACCESS_SECRET } = require('../../main.config');
const bcrypt = require('bcryptjs');
const userModel = require('../../models/user.model');
const courseModel = require('../../models/entities/course.model');

const register = async (req, res, next) => {
    try {
        const { username, email, password, profilePicture } = req.body;
        let passwordHash;

        if (!email || !password) {
            return res
                .status(422)
                .json({ error: 'please add email or password' });
        }

        const alreadyExists = await userModel.findOne({ email });
        console.log(alreadyExists);
        if (alreadyExists) {
            return res.status(403).json({ error: 'User already exists!' });
        }

        passwordHash = await bcrypt.hash(password, 10);

        const teacher = await new userModel({
            username,
            email,
            passwordHash,
            profilePicture,
            role: 'teacher',
        }).save();

        return res.status(201).json({
            message: 'Teacher user created successfully!',
            user: teacher,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: 'Internal server error!' });
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(403).json({ error: 'Invalid user credentials!' });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(403).json({ error: 'Invalid user credentials!' });
    }

    if (
        user.role !== 'teacher' &&
        user.role !== 'admin'
    ) {
        return res.status(403).json({ error: 'User is not teacher!' });
    }

    bcrypt
        .compare(password, user.passwordHash)
        .then((doMatch) => {
            if (doMatch) {
                const token = jwt.sign(
                    { id: user._id, role: user.role },
                    ACCESS_SECRET
                );
                res.status(201).json({
                    message: 'Logged In Successfully!',
                    token,
                });
            } else {
                return res.status(403).json({ error: 'Invalid password!' });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

const getTeachers = async (req, res) => {
    try {
        const teachers = await userModel.find({
            $or: [{ role: 'teacher' }, { role: 'admin' }],
        });
        return res.status(200).json({ teachers });
    } catch (error) {
        console.error('Error getting teachers:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await userModel.findById(id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        if (teacher.role !== 'teacher' && teacher.role !== 'admin') {
            return res.status(403).json({ message: 'User is not a teacher' });
        }
        await courseModel.deleteMany({ teacherId: id });
        await userModel.findByIdAndDelete(id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        return res
            .status(200)
            .json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error('Error deleting teacher:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { login, register, getTeachers, deleteTeacher };
