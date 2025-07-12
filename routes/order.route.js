const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const {
    createOrder,
    getMyOrders,
    getOrderById,
    makeOrderAsPaid,
} = require('../controllers/order.controller');


router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById); // Assuming getOrderById is defined in the controller
router.put('/:id/pay', protect, makeOrderAsPaid);
module.exports = router;
