const express = require('express');

const router = express.Router();

const {
    addProductToWishlist,
    DeleteProductFromWishlist,
    getWishlist
} = require('../controllers/wishlist.controller');

const protect = require('../middlewares/protect.middleware');

router.route('/')
    .get(protect.auth, getWishlist)
    .post(protect.auth, addProductToWishlist);

router.route('/:productId')
    .delete(protect.auth, DeleteProductFromWishlist);

module.exports = router;