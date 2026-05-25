const express = require('express');

const router = express.Router();

const {
    addProductToWishlist,
    DeleteProductFromWishlist,
    getWishlist
} = require('../controllers/wishlist.controller');

const protect = require('../middlewares/protect.middleware');

router.route('/')
    .get(protect.auth, protect.allowedTo('user', 'admin', 'manager'), getWishlist)
    .post(protect.auth, protect.allowedTo('user', 'admin', 'manager'), addProductToWishlist);

router.route('/:productId')
    .delete(protect.auth, protect.allowedTo('user', 'admin', 'manager'), DeleteProductFromWishlist);

module.exports = router;