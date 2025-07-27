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

router.post('/', uploadBrandImage, resizeImage, createBrandValidator, createBrand);
router.get('/', getAllBrands);
router.get('/:id', getBrandValidator, getBrandById);
router.put('/:id', updateBrandValidator, updateBrand);
router.delete('/:id', deleteBrandValidator, deleteBrand);


module.exports = router;