const {
    cheatSheetModel,
    subTopicModel,
} = require('../../models/entities/cheatsheet.model');

const createCheatSheet = async (req, res, next) => {
    try {
        const {
            params: { id: courseId },
            body: { title },
        } = req;

        if (!title) throw new Error('please provide title');

        const checkCheat = await cheatSheetModel.findOne({
            title,
            courseId,
        });

        if (checkCheat) {
            return res.status(200).json({
                success: true,
                message: 'cheat sheet already exists',
            });
        }
        await cheatSheetModel.create({
            title,
            courseId,
        });

        return res.status(200).json({
            success: true,
            message: 'cheat sheet created!',
        });
    } catch (e) {
        next(e);
    }
};

const addSubTopic = async (req, res, next) => {
    try {
        const {
            params: { cheatId },
            body: { title, content },
        } = req;

        if (!title || !content) {
            throw new Error('Provide both title and content!');
        }

        const subtopicCreated = await subTopicModel.create({ title, content });

        const cheatSheet = await cheatSheetModel.findById(cheatId);
        cheatSheet.subTopics.push(subtopicCreated.id);

        await cheatSheet.save();

        return res.json({ success: true, message: 'added subtopic' });
    } catch (err) {
        next(err);
    }
};

const getcheatsheet = async (req, res, next) => {
    try {
        const courseId = req.params.id;

        const cheatSheet = await cheatSheetModel
            .find({ courseId })
            .populate('subTopics');
        if (!cheatSheet)
            throw new Error('cant find cheat sheet for the given course');
        return res.status(200).json({ success: true, cheatSheet });
    } catch (e) {
        next(e);
    }
};

const updateCheatTitle = async (req, res, next) => {
    try {
        const cheatId = req.params.cheatId;
        const updateCheatTitle = await cheatSheetModel.findOneAndUpdate(
            { _id: cheatId },
            {
                $set: {
                    title: req.body.title,
                },
            },
            { new: true }
        );
        if (!updateCheatTitle)
            throw new Error('could not update the cheat sheet');

        return res
            .status(200)
            .json({ success: true, message: 'cheat title updated' });
    } catch (e) {
        next(e);
    }
};

const updateSubTopic = async (req, res, next) => {
    try {
        const {
            params: { subId },
            body: { title, content },
        } = req;

        const updateCheatSub = await subTopicModel.findByIdAndUpdate(
            subId,
            { title, content },
            { new: true }
        );
        if (!updateCheatSub)
            throw new Error('could not update the sub content');

        return res
            .status(200)
            .json({ success: true, message: 'updated the cheat content' });
    } catch (e) {
        next(e);
    }
};
const deleteSubtopic = async (req, res, next) => {
    try {
        const { cheatId, subId } = req.params;

        const deleteCheatSub = await subTopicModel.findByIdAndDelete(subId);

        await cheatSheetModel.findByIdAndUpdate(
            cheatId,
            {
                $pull: {
                    'subTopic._id': subId,
                },
            },
            { new: true }
        );

        if (!deleteCheatSub)
            throw new Error('could not delete the sub content');

        return res
            .status(200)
            .json({ success: true, message: 'deleted the cheat content' });
    } catch (e) {
        next(e);
    }
};

const deleteCheat = async (req, res, next) => {
    try {
        const cheatId = req.params.cheatId;

        const deleteCheat = await cheatSheetModel.findByIdAndDelete(cheatId);

        if (!deleteCheat) throw new Error('could not delete the cheat');

        return res
            .status(200)
            .json({ success: true, message: 'deleted the cheat' });
    } catch (e) {
        next(e);
    }
};

module.exports = {
    createCheatSheet,
    getcheatsheet,
    updateCheatTitle,
    updateSubTopic,
    deleteSubtopic,
    deleteCheat,
    addSubTopic,
};
