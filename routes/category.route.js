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

const {
    createCategoryValidator,
    getCategoryValidator,
    deleteCategoryValidator,
    updateCategoryValidator
} = require('../utils/validators/category.validator');


router.post('/', uploadSingleImage, resizeImage, createCategoryValidator, createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryValidator, getCategoryById);
router.put('/:id', uploadSingleImage, resizeImage, updateCategoryValidator, updateCategory);
router.delete('/:id', deleteCategoryValidator, deleteCategory);
module.exports = router;
