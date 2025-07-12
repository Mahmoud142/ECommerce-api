const express = require('express');
const router = express.Router();
const { createOrder,getMyOrders } = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');


router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);

module.exports = router;
