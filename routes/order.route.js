const express = require('express');
const router = express.Router();
const {
    createCashOrder,
} = require('../controllers/order.controller');

const protect = require('../middlewares/protect.middleware');

router.route('/:cartId')
    .post(protect.auth, protect.allowedTo('user'), createCashOrder)

module.exports = router;
