const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/auth.middleware');
const {
    createOrder,
    getMyOrders,
    getOrderById,
    makeOrderAsPaid,
    markOrderAsDelivered
} = require('../controllers/order.controller');


router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, makeOrderAsPaid);
router.put('/:id/deliver', protect, admin, markOrderAsDelivered); 
module.exports = router;
