const { StatusCodes } = require("http-status-codes");
const Category = require("../../models/entities/courseCategory.model");

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({
            name: name
        });
        await category.save();

        res.status(201).json({ message: "Category created Successfully!" })
    } catch (error) {
        res.status(500).json({ message: "Failed to create category" });
    }
}

const updateCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCategory = await Category.findOneAndUpdate(
            id,
            { ...req.body },
            { new: true }
        );

        if (updatedCategory) {
            res.status(201).json({
                message: "Category updated Successfully!",
                Category: updatedCategory,
            })
        }
        else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({
            message: 'An error occured while updating the category.',
        });
    }
}

const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json(category);
    } catch (error) {
     
        console.error(error);
        res.status(500).json({ message: "Failed to fetch category" });
    }
};

const getAllCategory = async (req,res) =>{
    try {
        console.log("Hello");
        const categories = await Category.find();

        if(!categories){
            return res.status(404).json({message: "No Categories found!"})
        }

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({message: "Failed to fetch categories."})
    }
}
const deleteCategory = async (req, res) => {
    const {id} = req.params;
    try {
        const deleted = await Category.deleteMany({_id:id});
        if (!deleted.deletedCount){
            return res.status(StatusCodes.NO_CONTENT).json({
                message: "Category not found"
            })
        }
        console.log(deleted);
        return res.status(StatusCodes.OK).json({
            message: "Category deleted!"
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "msg":"Some error deleting category"
        })
    }
}

module.exports ={
    createCategory,
    updateCategory,
    getAllCategory,
    getCategory,
    deleteCategory
}