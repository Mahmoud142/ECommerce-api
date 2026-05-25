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


const {
    createProductValidator,
    getProductValidator,
    updateProductValidator,
    deleteProductValidator } = require('../utils/validators/product.validator');

const protect = require('../middlewares/protect.middleware');

router.route('/')
    .post(protect.auth, protect.allowedTo('admin', 'manager'), uploadProductImages, resizeProductImages, createProductValidator, createProduct)
    .get(getAllProducts);

router.route('/:id')
    .get(getProductValidator, getProductById)
    .put(protect.auth, protect.allowedTo('admin', 'manager'), uploadProductImages, resizeProductImages, updateProductValidator, updateProduct)
    .delete(protect.auth, protect.allowedTo('admin'), deleteProductValidator, deleteProduct);

module.exports = router;