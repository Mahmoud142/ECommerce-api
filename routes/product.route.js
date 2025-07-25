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
// const { protect, admin } = require('../middlewares/auth.middleware');
router.post('/', uploadProductImages, resizeProductImages, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/reviews', createProductReview);



module.exports = router;