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

router.route('/')
    .post(auth, addProductToCart)
    .get(auth, getLoggedUserCart);

router.route('/applyCoupon')
    .put(auth, applyCouponToCart);

router.route('/:productId')
    .put(auth, updateCartProductQuantity)
    .delete(auth, deleteProductFromCart);

router.route('/')// clear all cart items
    .delete(auth, clearLoggedUserCart);

module.exports = router;