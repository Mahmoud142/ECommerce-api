const express = require('express');

const router = express.Router();

const {
    addProductToWishlist,
    DeleteProductFromWishlist,
    getWishlist
} = require('../controllers/wishlist.controller');

const protect = require('../middlewares/protect.middleware');

router.post('/', protect.auth, addProductToWishlist);
router.delete('/:productId', protect.auth, DeleteProductFromWishlist);
router.get('/', protect.auth, getWishlist);


module.exports = router;