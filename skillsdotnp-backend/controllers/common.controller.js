const categoryModel = require('../models/category.model');
const enrolledUserModel = require('../models/entities/enrolledUser.model');
const userModel = require('../models/user.model');

const getCategory = (req, res, next) => {
    categoryModel
        .find({})
        .then((categories) => {
            return res.json({
                categories,
            });
        })
        .catch((err) =>
            res.status(400).json({
                error: 'Error fetching all categories!',
            })
        );
};

const addCategory = (req, res, next) => {
    const { categoryName } = req.body;
    new categoryModel({
        categoryName,
    })
        .save()
        .then((savedCategory) => {
            return res.status(201).json({
                message: 'Category added!',
                savedCategory
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: 'Error adding category!' });
        });
};

const deleteCategory = (req, res, next) => {
    const { id } = req.params;

    categoryModel
        .findByIdAndDelete(id)
        .then((deletedCategory) => {
            return res.status(202).json({
                message: 'Category Deleted!',
                deletedCategory
            });
        })
        .catch((err) =>
            res.status(400).json({
                error: 'Error deleting category!',
            })
        );
};

const getAllStudents = async (req, res) => {
    try {
        let students = await userModel.find({ role: "user" });
        students = await Promise.all(students.map( async (student) => {
            student = student.toObject();
            let enrolledCourses = await enrolledUserModel.find({ userId: student._id }).populate("courseId");
            student.enrolledCourses = enrolledCourses;
            return student;
        }));

        return res.status(200).json({
            students,
        });

    } catch (error) {
        console.error("Error getting all students:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getCategory,
    addCategory,
    deleteCategory,
    getAllStudents
};
