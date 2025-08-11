const express = require('express');
const router = express.Router();
const {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
    uploadBrandImage,
    resizeImage
} = require('../controllers/brand.controller');

const {
    createBrandValidator,
    getBrandValidator,
    updateBrandValidator,
    deleteBrandValidator
} = require('../utils/validators/brand.validator');

router.route('/')
    .post(uploadBrandImage, resizeImage, createBrandValidator, createBrand)
    .get(getAllBrands);
router.route('/:id')
    .get(getBrandValidator, getBrandById)
    .put(updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand);

module.exports = router;