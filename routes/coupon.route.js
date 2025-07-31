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

router.get('/',  getAllCoupons);
router.get('/:id',  getCoupon);
router.post('/',  createCoupon);
router.put('/:id',  updateCoupon);
router.delete('/:id',  deleteCoupon);

module.exports = router;