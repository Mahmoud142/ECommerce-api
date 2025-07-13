const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/auth.middleware');
const {
    createOrder,
    getMyOrders,
    getOrderById,
    makeOrderAsPaid,
    markOrderAsDelivered,
    getAllOrders
} = require('../controllers/order.controller');


router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, makeOrderAsPaid);
router.put('/:id/deliver', protect, admin, markOrderAsDelivered); 
module.exports = router;
