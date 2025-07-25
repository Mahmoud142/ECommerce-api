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


router.post('/', createSubcategoryValidator, createSubCategory);
router.get('/', getAllSubCategories);
router.get('/:id', getSubCategoryValidator, getSubCategory);
router.put('/:id', updateSubCategoryValidator, updateSubCategory);
router.delete('/:id', deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;