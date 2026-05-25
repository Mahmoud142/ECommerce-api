const express = require('express');
const router = express.Router();
const {
    createCashOrder,
    getAllOrders,
    getSingleOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
    checkoutSession
} = require('../controllers/order.controller');

const protect = require('../middlewares/protect.middleware');

router.post('/checkout-session/:cartId', protect.auth, protect.allowedTo('user'), checkoutSession);

router.route('/:cartId')
    .post(protect.auth, protect.allowedTo('user'), createCashOrder)

router.route('/')
    .get(protect.auth, protect.allowedTo('user', 'admin'), getAllOrders)

router.route('/:id')
    .get(protect.auth, protect.allowedTo('user', 'admin'), getSingleOrder)

router.put('/:id/pay', protect.auth, protect.allowedTo('admin', 'manager'), updateOrderToPaid)
router.put('/:id/deliver', protect.auth, protect.allowedTo('admin', 'manager'), updateOrderToDelivered)
module.exports = router;
