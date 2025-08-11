const express = require('express');
const router = express.Router();
const { createSubCategory,
    getSubCategory,
    getAllSubCategories,
    updateSubCategory,
    deleteSubCategory } = require('../controllers/subcategory.controller');

const { createSubcategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator } = require('../utils/validators/subcategory.validator');

router.route('/')
    .post(createSubcategoryValidator, createSubCategory)
    .get(getAllSubCategories);

router.route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(updateSubCategoryValidator, updateSubCategory)
    .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;