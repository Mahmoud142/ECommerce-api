const express = require('express');
const router = express.Router();
const { createSubCategory,
    getSubCategory,
    getAllSubCategories,
    updateSubCategory,
    deleteSubCategory } = require('../controllers/subcategory.controller');



router.post('/', createSubCategory);
router.get('/', getAllSubCategories);
router.get('/:id', getSubCategory);
router.put('/:id', updateSubCategory);
router.delete('/:id', deleteSubCategory);

module.exports = router;