const { check } = require('express-validator');
const { validatorMiddleware } = require('../../middlewares/validator.middleware');
const User = require('../../models/user.model');
const slugify = require('slugify');


exports.loginValidator = [
    check('email').notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    check('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    validatorMiddleware
]

exports.registerValidator = [
    check('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 char')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .custom((val) =>
            User.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error(`Email already in use`));
                }
            })
        ),

    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .custom((value, { req }) => {
            if (value !== req.body.confirmPassword) {
                return Promise.reject(new Error('Passwords do not match'));
            }
            return true;
        }),

    check('confirmPassword')
        .notEmpty().withMessage('Confirm Password is required'),

    check('phone')
        .optional()
        .isMobilePhone().withMessage('Invalid phone number format'),
    validatorMiddleware
]