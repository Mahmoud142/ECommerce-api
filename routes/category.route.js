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

router.route('/')
    .post(uploadSingleImage, resizeImage, createCategoryValidator, createCategory)
    .get(getCategories);
router.route('/:id')
    .get(getCategoryValidator, getCategoryById)
    .put(uploadSingleImage, resizeImage, updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
