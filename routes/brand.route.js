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

const protect = require('../middlewares/protect.middleware');

router.route('/')
    .post(protect.auth, protect.allowedTo('admin', 'manager'), uploadBrandImage, resizeImage, createBrandValidator, createBrand)
    .get(getAllBrands);
router.route('/:id')
    .get(getBrandValidator, getBrandById)
    .put(protect.auth, protect.allowedTo('admin', 'manager'), updateBrandValidator, updateBrand)
    .delete(protect.auth, protect.allowedTo('admin'), deleteBrandValidator, deleteBrand);

module.exports = router;