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

router.route('/')
    .post(uploadProductImages, resizeProductImages, createProductValidator, createProduct)
    .get(getAllProducts);

router.route('/:id')
    .get(getProductValidator, getProductById)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct);
    
router.route('/:id/reviews')
    .post(createProductReview);



module.exports = router;