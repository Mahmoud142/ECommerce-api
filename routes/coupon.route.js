const express = require('express');
const router = express.Router();
const {
    getAllCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon
} = require('../controllers/coupon.controller');
const protect = require('../middlewares/protect.middleware');

router.route('/')
    .post(protect.auth, protect.allowedTo('admin', 'manager'), createCoupon)
    .get(protect.auth, protect.allowedTo('admin', 'manager'), getAllCoupons);
router.route('/:id')
    .get(protect.auth, protect.allowedTo('admin', 'manager'), getCoupon)
    .put(protect.auth, protect.allowedTo('admin', 'manager'), updateCoupon)
    .delete(protect.auth, protect.allowedTo('admin', 'manager'), deleteCoupon);

module.exports = router;