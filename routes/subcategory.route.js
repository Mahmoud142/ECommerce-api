const express = require('express');
const router = express.Router({ mergeParams: true });
const { createSubCategory,
    getSubCategory,
    getAllSubCategories,
    updateSubCategory,
    deleteSubCategory } = require('../controllers/subcategory.controller');

const { createSubcategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator } = require('../utils/validators/subcategory.validator');

const protect = require('../middlewares/protect.middleware');

router.route('/')
    .post(protect.auth, protect.allowedTo('admin', 'manager'), createSubcategoryValidator, createSubCategory)
    .get(getAllSubCategories);

router.route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(protect.auth, protect.allowedTo('admin', 'manager'), updateSubCategoryValidator, updateSubCategory)
    .delete(protect.auth, protect.allowedTo('admin'), deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;