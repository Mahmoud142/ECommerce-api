const express = require('express');
const router = express.Router();



const {
    addProductToCart,
    getLoggedUserCart,
    updateCartProductQuantity,
    deleteProductFromCart,
    clearLoggedUserCart,
    applyCouponToCart
} = require('../controllers/cart.controller');

const { auth } = require('../middlewares/protect.middleware');

router.post('/', auth, addProductToCart);
router.get('/', auth, getLoggedUserCart);
router.put('/applyCoupon', auth, applyCouponToCart);
router.put('/:productId', auth, updateCartProductQuantity);
router.delete('/:productId', auth, deleteProductFromCart);
router.delete('/', auth, clearLoggedUserCart);

module.exports = router;