const router = require('express').Router();
const {
    createCategory,
    updateCategory,
    getCategory,
    getAllCategory,
    deleteCategory,
} = require('../controllers/Course/courseCategory.controller');
const { verifyToken, tokenExtractor } = require('../middleware/tokenAuth');

router.post('/coursesCategory/category', tokenExtractor, verifyToken, createCategory);
router.get('/coursesCategory/category', getAllCategory);
router.get('/coursesCategory/category/:id', getCategory);
router.put('/coursesCategory/category/:id', tokenExtractor, verifyToken, updateCategory);
router.delete('/coursesCategory/category/:id', tokenExtractor, verifyToken, deleteCategory);

module.exports = router;
