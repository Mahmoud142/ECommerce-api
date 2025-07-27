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


router.post('/', uploadBrandImage, resizeImage, createBrand);
router.get('/', getAllBrands);
router.get('/:id', getBrandById);
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);


module.exports = router;