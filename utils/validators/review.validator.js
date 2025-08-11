const { check } = require('express-validator')
const { validatorMiddleware } = require('../../middlewares/validator.middleware');
const Review = require('../../models/review.model');



exports.createReviewValidator = [
    check('review')
        .notEmpty()
        .withMessage('Review cannot be empty')
        .custom(async (val, { req }) => {
            const review = await Review.findOne({ user: req.user._id, product: req.body.product });
            if (review) {
                return Promise.reject(new Error('You have already reviewed this product'));
            }
            return true;
        }),
    check('rating')
        .isNumeric()
        .withMessage('Rating must be a number')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    check('user')
        .isMongoId()
        .withMessage('Invalid user ID'),
    check('product')
        .isMongoId()
        .withMessage('Invalid product ID'),
    validatorMiddleware
]

exports.getReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid review ID')
    ,
    validatorMiddleware
]

exports.updateReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid review ID')
        .custom((val, { req }) => {
            return Review.findOne({ _id: val }).then((review) => {
                if (!review) {
                    return Promise.reject(new Error('Review not found'));
                }
                
                if (review.user._id.toString() !== req.user._id.toString()) {
                    return Promise.reject(new Error('You are not authorized to update this review'));
                }
            })
        }),
    check('rating')
        .optional()
        .isNumeric()
        .withMessage('Rating must be a number')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    validatorMiddleware
]

exports.deleteReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid review ID')
        .custom((val, { req }) => {
            if (req.user.role === 'user') {
                return Review.findOne({ _id: val, user: req.user._id })
                    .then((review) => {
                        if (!review) {
                            return Promise.reject(new Error('Review not found'));
                        }
                    })
            }
            return true;
        }),
    validatorMiddleware
]