const express = require('express');
const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    createProductReview
} = require('../controllers/product.controller');
const { protect, admin } = require('../middlewares/auth.middleware');


router.post('/', protect, admin, createProduct); 
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/reviews', protect, createProductReview);
module.exports = router;