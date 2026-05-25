const express = require("express");
const router = express.Router();

const {
    addProductToCart,
    getLoggedUserCart,
    updateCartProductQuantity,
    deleteProductFromCart,
    clearLoggedUserCart,
    applyCouponToCart,
} = require("../controllers/cart.controller");

const protect = require("../middlewares/protect.middleware");

router
    .route("/")
    .post(protect.auth, protect.allowedTo("user"), addProductToCart)
    .get(protect.auth, protect.allowedTo("user"), getLoggedUserCart);

router
    .route("/applyCoupon")
    .put(protect.auth, protect.allowedTo("user"), applyCouponToCart);

router
    .route("/:productId")
    .put(protect.auth, protect.allowedTo("user"), updateCartProductQuantity)
    .delete(protect.auth, protect.allowedTo("user"), deleteProductFromCart);

router
    .route("/") // clear all cart items
    .delete(protect.auth, protect.allowedTo("user"), clearLoggedUserCart);

module.exports = router;
