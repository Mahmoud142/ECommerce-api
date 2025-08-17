const Review = require('../models/review.model');
const asyncWrapper = require('../middlewares/asyncWrapper');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');

// used in review route
exports.createFilterObject = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) {
        filterObject = { product: req.params.productId };
    }
    req.filterObject = filterObject;
    next();
}

//@desc Create a new review
//@route POST /api/reviews
//@access Private/user
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

//@desc Get all reviews
//@route GET /api/reviews
//@access public
exports.getReviews = asyncWrapper(async (req, res, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const reviews = await Review.find().skip(skip).limit(limit);
    res.status(200).json({
        status: SUCCESS,
        page,
        length: reviews.length,
        data: reviews,
    });
})

//@desc Get a single review
//@route GET /api/reviews/:id
//@access public
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

//desc Update a review
//@route PUT /api/reviews/:id
//@access Private/user
exports.updateReview = asyncWrapper(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

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

//@desc Delete a review
//@route DELETE /api/reviews/:id
//@access Private/user
exports.deleteReview = asyncWrapper(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
        return res.status(404).json({
            status: FAIL,
            message: 'Review not found'
        });
    }
    res.status(200).json({
        status: SUCCESS,
        data: null
    });
})