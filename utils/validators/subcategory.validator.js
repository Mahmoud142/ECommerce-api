const { check } = require('express-validator');
const slugify = require('slugify');
const { validatorMiddleware } = require('../../middlewares/validator.middleware');

exports.createSubcategoryValidator = [
    check('name')
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 3, max: 50 }).withMessage("Name must be between 3 and 50 characters long")
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),
    check('category')
        .isMongoId().withMessage("Invalid category ID")
        .notEmpty().withMessage("Category is required"),
    validatorMiddleware
];

exports.getSubCategoryValidator = [
    check('id')
        .isMongoId().withMessage("Invalid subcategory ID"),
    validatorMiddleware
]

exports.updateSubCategoryValidator = [
    check('id')
        .isMongoId().withMessage("Invalid subcategory ID"),
    check('name')
        .optional()
        .isLength({ min: 3, max: 50 }).withMessage("Name must be between 3 and 50 characters long")
        .custom((value, { req }) => {
            if (value) {
                req.body.slug = slugify(value);
            }
            return true;
        }),
    check('slug')
        .optional()
        .custom((value, { req }) => {
            if (value) {
                req.body.slug = slugify(value);
            }
            return true;
        }),
    check('category')
        .optional()
        .isMongoId().withMessage("Invalid category ID"),
    validatorMiddleware
]

exports.deleteSubCategoryValidator = [
    check('id')
        .isMongoId().withMessage("Invalid subcategory ID"),
    validatorMiddleware
]
