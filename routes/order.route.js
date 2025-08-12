const express = require('express');
const router = express.Router();
const {
    createCashOrder,
    getAllOrders,
    getSingleOrder,
    updateOrderToPaid
} = require('../controllers/order.controller');

const protect = require('../middlewares/protect.middleware');

router.route('/:cartId')
    .post(protect.auth, protect.allowedTo('user'), createCashOrder)

router.route('/')
    .get(protect.auth, protect.allowedTo('user'), getAllOrders)

router.route('/:id')
    .get(protect.auth, protect.allowedTo('user'), getSingleOrder)

router.put('/:id/pay', protect.auth, updateOrderToPaid) // add admin protect later

module.exports = router;
