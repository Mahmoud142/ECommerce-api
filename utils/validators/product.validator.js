const { check } = require('express-validator');
const slugify = require('slugify');
const Category = require('../../models/category.model');
const SubCategory = require('../../models/subcategory.model');
const {validatorMiddleware} = require('../../middlewares/validator.middleware');


exports.createProductValidator = [
    check('name')
        .notEmpty().withMessage('Product title is required')
        .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters long')
        .custom((value, { req }) => {
            req.body.slug = slugify(value)
            return true;
        }),
    
    check('description')
        .notEmpty().withMessage('Product description is required')
        .isLength({ max: 1500 }).withMessage('Too long description'),
    
    check('quantity')
        .notEmpty().withMessage('Product quantity is required')
        .isNumeric().withMessage('Quantity must be a number')
        .isInt({ min: 0 }).withMessage('Quantity cannot be negative'),
    
    check('sold')
        .optional()
        .isNumeric().withMessage('Sold must be a number')
        .isInt({ min: 0 }).withMessage('Sold cannot be negative'),
    
    check('price')
        .notEmpty().withMessage('Product price is required')
        .isNumeric().withMessage('Price must be a number')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number')
        .isLength({ max: 30 }).withMessage('Too long price'),
    
    check('priceAfterDiscount')
        .optional()
        .isNumeric().withMessage('Price after discount must be a number')
        .isFloat({ min: 0 }).withMessage('Price after discount must be a positive number')
        .custom((value, { req }) => {
            if (value && value >= req.body.price) {
                throw new Error('Price after discount must be less than the original price');
            }
            return true;
        }),
    
    check('availableColors')
        .optional()
        .toArray(),
    
    check('images')
        .optional()
        .toArray(),
    
    check('category')
        .notEmpty().withMessage('Product category is required')
        .isMongoId().withMessage('Invalid category ID')
        .custom((categoryId) => {
            return Category.findById(categoryId).then(category => {
                if (!category) {
                    return Promise.reject(new Error(`Category with ID ${categoryId} does not exist`));
                }
                return true;
            })
        }),
    
    check('subcategory')
        .optional()
        .toArray()
        .isMongoId().withMessage('Invalid subcategory ID')
        .custom((val, { req }) =>
            SubCategory.find({
                category: req.body.category,
            }).then((subcategories) => {
                const subIdsInDB = [];
                // push all subcategory ids in the array
                subcategories.forEach((subcategory) => {
                    subIdsInDB.push(subcategory._id.toString());
                });
                // check if all subcategory ids in the request body exist in the database
                const checker = (arr, target) => target.every((t) => arr.includes(t));
                if (!checker(subIdsInDB, val)) {
                    return Promise.reject(new Error("Subcategory not belong to category"));
                }
                return true;
            })
    ),
    
    check('ratingsAverage')
        .optional()
        .isNumeric()
        .withMessage('Ratings average must be a number')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Ratings average must be between 1 and 5'),
    
    check('ratingsQuantity')
        .optional()
        .isNumeric()
        .withMessage('Ratings quantity must be a number'),
    validatorMiddleware
]

exports.getProductValidator = [
    check('id')
        .notEmpty().withMessage('Product ID is required')
        .isMongoId().withMessage('Invalid product ID format')
    , validatorMiddleware
]

exports.updateProductValidator = [
    check('id')
        .notEmpty().withMessage('Product ID is required')
        .isMongoId().withMessage('Invalid product ID format'),
    check('name')
        .optional()
        .notEmpty().withMessage('Product title is required')
        .isLength({ max: 100 }).withMessage('Too long title')
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
        }),
    validatorMiddleware
]

exports.deleteProductValidator = [
    check('id')
        .notEmpty().withMessage('Product ID is required')
        .isMongoId().withMessage('Invalid product ID format'),
    validatorMiddleware
]