const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    makeOrderAsPaid,
    markOrderAsDelivered,
    getAllOrders
} = require('../controllers/order.controller');


router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/pay', makeOrderAsPaid);
router.put('/:id/deliver', markOrderAsDelivered);
module.exports = router;
