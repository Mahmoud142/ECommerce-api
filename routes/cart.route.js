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
    .post(protect.auth, protect.allowedTo("user", "admin", "manager"), addProductToCart)
    .get(protect.auth, protect.allowedTo("user", "admin", "manager"), getLoggedUserCart);

router
    .route("/applyCoupon")
    .put(protect.auth, protect.allowedTo("user", "admin", "manager"), applyCouponToCart);

router
    .route("/:productId")
    .put(protect.auth, protect.allowedTo("user", "admin", "manager"), updateCartProductQuantity)
    .delete(protect.auth, protect.allowedTo("user", "admin", "manager"), deleteProductFromCart);

router
    .route("/") // clear all cart items
    .delete(protect.auth, protect.allowedTo("user", "admin", "manager"), clearLoggedUserCart);

module.exports = router;
