const express = require('express');
const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    createProductReview,
    uploadProductImages,
    resizeProductImages } = require('../controllers/product.controller');

// const {
// createProductValidator } = require('../utils/validators/product.validator');

const {
    createProductValidator,
    getProductValidator,
    updateProductValidator,
    deleteProductValidator } = require('../utils/validators/product.validator');

router.post('/', uploadProductImages, resizeProductImages, createProductValidator, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductValidator, getProductById);
router.put('/:id', updateProductValidator, updateProduct);
router.delete('/:id', deleteProductValidator, deleteProduct);
router.post('/:id/reviews', createProductReview);



module.exports = router;