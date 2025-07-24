const slugify = require('slugify');
const { body, check } = require('express-validator');

const { validatorMiddleware } = require('../../middlewares/validator.middleware');


exports.createCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Name must be between 3 and 50 characters long")
        .custom((value, { req }) => {
            req.body.name = slugify(value);
            return true;
        }),
    validatorMiddleware
];

exports.getCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage("Invalid category ID"),
    validatorMiddleware
];

exports.deleteCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage("Invalid category ID"),
    validatorMiddleware
];

exports.updateCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage("Invalid category ID"),
    check('name')
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage("Name must be between 3 and 50 characters long"),
    check('slug')
        .optional()
        .custom((value, { req }) => {
            if (value) {
                req.body.slug = slugify(value);
            }
            return true;
        }),
    validatorMiddleware
]