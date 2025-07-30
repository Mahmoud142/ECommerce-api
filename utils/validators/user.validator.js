const { body, check } = require('express-validator');
const slugify = require('slugify');
const { validatorMiddleware } = require('../../middlewares/validator.middleware');
const User = require('../../models/user.model');
const bcrypt = require('bcrypt');



exports.createUserValidator = [
    check('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long')
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),
    
    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .custom((val) => {
            // Check if email is already in use
            return User.findOne({ email: val }).then(user => {
                if (user) {
                    return Promise.reject('Email already in use');
                }
            });
        }),
    
    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .custom(async (val, { req }) => {
            req.body.password = await bcrypt.hash(val, 10);
            if(val !== req.body.passwordConfirm) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    
    check('passwordConfirm')
        .notEmpty().withMessage('Confirm Password is required'),
    
    check('phone')
        .optional()
        .isMobilePhone().withMessage('Invalid phone number format'),
    validatorMiddleware
]

exports.updateUserValidator = [
    check('id')
        .notEmpty().withMessage('User ID is required')
        .isMongoId().withMessage('Invalid User ID format'),
    check('name')
        .optional()
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long')
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),
    check('email')
        .optional()
        .isEmail().withMessage('Invalid email format')
        .custom((val, { req }) => {
            return User.findOne({ email: val }).then(user => {
                if (user && user.id !== req.params.id) {
                    return Promise.reject('Email already in use');
                }
            });
        }),
    check('password')
        .optional()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .custom(async (val, { req }) => {
            if (val !== req.body.passwordConfirm) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    check('phone')
        .optional()
        .isMobilePhone().withMessage('Invalid phone number format'),
    validatorMiddleware
]

exports.getUserValidator = [
    check('id')
        .notEmpty().withMessage('User ID is required')
        .isMongoId().withMessage('Invalid User ID format'),
    validatorMiddleware
]

exports.deleteUserValidator = [
    check('id')
        .notEmpty().withMessage('User ID is required')
        .isMongoId().withMessage('Invalid User ID format'),
    validatorMiddleware
]

exports.changeUserPasswordValidator = [
    check('id')
        .notEmpty().withMessage('User ID is required')
        .isMongoId().withMessage('Invalid User ID format'),
    check('currentPassword')
        .notEmpty().withMessage('Current password is required'),
    check('confirmPassword')
        .notEmpty().withMessage('Confirm password is required'),
    check('password')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
        .custom(async (val, { req }) => {
            const user = await User.findById(req.params.id);
            const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isMatch) {
                throw new Error('Current password is incorrect');
            }
            // Check if new password and confirm password match
            if (val !== req.body.confirmPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    validatorMiddleware
]

exports.changeLoggedUserPasswordValidator = [
    check('currentPassword')
        .notEmpty().withMessage('Current password is required'),
    check('passwordConfirm')
        .notEmpty().withMessage('Confirm password is required'),
    check('password')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
        .custom(async (val, { req }) => {
            const user = await User.findById(req.user._id);
            const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isMatch) {
                throw new Error('Current password is incorrect');
            }
            // Check if new password and confirm password match
            if (val !== req.body.passwordConfirm) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    validatorMiddleware
]

exports.updateLoggedUserValidator = [
    check('name')
        .optional()
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long')
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),
    check('email')
        .optional()
        .isEmail().withMessage('Invalid email format')
        .custom((val, { req }) => {
            return User.findOne({ email: val }).then(user => {
                if (user && user.id !== req.params.id) {
                    return Promise.reject('Email already in use');
                }
            });
        }),
    check('phone')
        .optional()
        .isMobilePhone().withMessage('Invalid phone number format'),
    validatorMiddleware
]
