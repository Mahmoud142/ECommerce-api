const express = require('express');
const router = express.Router();
const {
    getAllCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon
} = require('../controllers/coupon.controller');
// const protect = require('../middlewares/protect.middleware');

router.route('/')
    .post(createCoupon)
    .get(getAllCoupons);
router.route('/:id')
    .get(getCoupon)
    .put(updateCoupon)
    .delete(deleteCoupon);

module.exports = router;