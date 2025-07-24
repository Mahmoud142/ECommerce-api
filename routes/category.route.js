const express = require('express');
const router = express.Router();

const {
    createCategory,
    uploadSingleImage,
    resizeImage,
    getCategories,
    updateCategory,
    deleteCategory,
    getCategoryById
} = require('../controllers/category.controller');



router.post('/', uploadSingleImage, resizeImage, createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put('/:id', uploadSingleImage, resizeImage, updateCategory);
router.delete('/:id', deleteCategory);
module.exports = router;
