const slugify = require("slugify");
const { check,body } = require('express-validator');
const {validatorMiddleware} = require('../../middlewares/validator.middleware');


exports.createBrandValidator = [
    check('name')
        .notEmpty().withMessage('Brand name is required')
        .isString().withMessage('Brand name must be a string')
        .isLength({ min: 3 }).withMessage('Brand name must be at least 3 characters long')
        .isLength({ max: 50 }).withMessage('Brand name must not exceed 50 characters')
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),
    validatorMiddleware
]

exports.updateBrandValidator = [
    check('id')
        .notEmpty().withMessage('Brand ID is required')
        .isMongoId().withMessage('Invalid brand ID format'),
    body('name')
        .optional()
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
        })
]



exports.getBrandValidator = [
    check('id')
        .notEmpty().withMessage('Brand ID is required')
        .isMongoId().withMessage('Invalid brand ID format'),
    validatorMiddleware
]

exports.deleteBrandValidator = [
    check('id')
        .notEmpty().withMessage('Brand ID is required')
        .isMongoId().withMessage('Invalid brand ID format'),
    validatorMiddleware
]
