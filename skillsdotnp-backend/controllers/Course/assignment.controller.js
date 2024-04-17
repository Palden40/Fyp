const assignment = require('../../models/entities/assignment.model');

const createAssignment = async (req, res, next) => {
    const { id, lessonId } = req.params;
    const { assignmentName, assignmentLink, assignmentDescription } = req.body;
    try {
        await assignment.create({
            assignmentName,
            assignmentDescription,
            assignmentLink,
            lessonId,
            courseId: id,
        });

        res.status(200).json({
            success: true,
            message: 'added assignment to lesson',
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({
            success: false,
            error: e.message,
        });
    }
};

const getAllAssignment = async (req, res, next) => {
    try {
        const allAssignments = await assignment.find({});
        if (!allAssignments) throw new Error('No Assignments to fetch');
        return res.status(200).json({ success: true, allAssignments });
    } catch (e) {
        console.log(e);
        res.status(400).json({ success: false, error: e.message });
    }
};

const getAssignmentByLessonId = async (req, res, next) => {
    const { lessonId } = req.params;
    try {
        const assignments = await assignment.find({ lessonId });

        if (!assignments.length) {
            return res.status(404).json({
                success: false,
                message: 'no assignements available for this lesson!',
            });
        }

        return res.json({
            success: true,
            assignments,
        });
    } catch (error) {
        next(error);
    }
};
const getAssignmentByCourse = async (req, res, next) => {
    const { id } = req.params;
    try {
        const assignments = await assignment.find({ courseId: id });
        res.status(200).json({
            success: true,
            assignments,
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({
            success: false,
            error: e.message,
        });
    }
};

const updateAssignment = async (req, res, next) => {
    const { id } = req.params;
    const { assignmentName, assignmentDescription, assignmentLink } = req.body;
    try {
        const updatedAssignment = await assignment.findByIdAndUpdate(id, {
            assignmentName,
            assignmentDescription,
            assignmentLink,
        });
        res.status(200).json({
            success: true,
            updatedAssignment,
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({
            success: false,
            error: e.message,
        });
    }
};

const deleteAssignment = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedAssignment = await assignment.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            deletedAssignment,
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({
            success: false,
            error: e.message,
        });
    }
};

module.exports = {
    createAssignment,
    getAssignmentByCourse,
    updateAssignment,
    deleteAssignment,
    getAllAssignment,
    getAssignmentByLessonId,
};
