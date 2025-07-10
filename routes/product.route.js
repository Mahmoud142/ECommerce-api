const express = require('express');
const router = express.Router();

const { createProduct } = require('../controllers/product.controller');
const { protect,admin } = require('../middlewares/auth.middleware');

// Route to create a new product
router.post('/', protect, admin, createProduct);

module.exports = router;