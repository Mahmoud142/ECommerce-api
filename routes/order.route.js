const express = require('express');
const router = express.Router();
const { createOrder,getMyOrders,getOrderById } = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');


router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById); // Assuming getOrderById is defined in the controller

module.exports = router;
