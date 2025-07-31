const Coupon = require('../models/coupon.model');
const asyncWrapper = require('../middlewares/asyncWrapper');
const AppError = require('../utils/appError');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');


// @desc      Create a new coupon
// @route     POST /api/coupons
// @access    Private/Admin
exports.getAllCoupons = asyncWrapper(async (req, res, next) => {
    const coupons = await Coupon.find();
    return res.status(200).json({
        status: SUCCESS,
        data: { coupons }
    });
});

// @desc      Create a new coupon
// @route     POST /api/coupons
// @access    Private/Admin
exports.getCoupon = asyncWrapper(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
        return next(AppError.create('Coupon not found', 404, FAIL));
    }
    return res.status(200).json({
        status: SUCCESS,
        data: { coupon }
    });
});

// @desc      Create a new coupon
// @route     POST /api/coupons
// @access    Private/Admin
exports.createCoupon = asyncWrapper(async (req, res, next) => {
    const createdCoupon = await Coupon.create(
        {
            name: req.body.name,
            expire: req.body.expire,
            discount: req.body.discount
        }
    );
    return res.status(201).json({
        status: SUCCESS,
        data: { coupon: createdCoupon }
    });
});

// @desc      Update a coupon
// @route     PUT /api/coupons/:id
// @access    Private/Admin
exports.updateCoupon = asyncWrapper(async (req, res, next) => {
    const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, req.body,
        { new: true, runValidators: true });
    if (!updatedCoupon) {
        return next(AppError.create('Coupon not found', 404, FAIL));
    }
    return res.status(200).json({
        status: SUCCESS,
        data: { coupon: updatedCoupon }
    });
});

// @desc      Delete a coupon
// @route     DELETE /api/coupons/:id
// @access    Private/Admin
exports.deleteCoupon = asyncWrapper(async (req, res, next) => {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!deletedCoupon) {
        return next(AppError.create('Coupon not found', 404, FAIL));
    }
    return res.status(200).json({
        status: SUCCESS,
        message: 'Coupon deleted successfully'
    });
})
