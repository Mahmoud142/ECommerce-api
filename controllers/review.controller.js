const Review = require('../models/review.model');
const asyncWrapper = require('../middlewares/asyncWrapper');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');

exports.createFilterObject = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) {
        filterObject = { product: req.params.productId };
    }
    req.filterObject = filterObject;
    next();
}

exports.createReview = asyncWrapper(async (req, res, next) => {
    const createdReview = await Review.create({
        review: req.body.review,
        rating: req.body.rating,
        user: req.user._id,
        product: req.body.product
    })
    res.status(201).json({
        status: SUCCESS,
        data: createdReview
    });
})

exports.getReviews = asyncWrapper(async (req, res, next) => {
    const reviews = await Review.find();
    res.status(200).json({
        status: SUCCESS,
        data: reviews
    });
})

exports.getReview = asyncWrapper(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return res.status(404).json({
            status: FAIL,
            message: 'Review not found'
        });
    }
    res.status(200).json({
        status: SUCCESS,
        data: review
    });
})