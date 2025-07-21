const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const AppError = require('../utils/appError');
const asyncWrapper = require('../middlewares/asyncWrapper');

const getUserProfile = asyncWrapper(async (req, res, next) => {

    if (!req.user) {
        const err = AppError.create('User not found', 404, FAIL);
        return next(err);
    }
    res.status(200).json({
        status: SUCCESS,
        message: 'User profile fetched successfully',
        data: { user: req.user }
    });
});

const updateUserProfile = asyncWrapper(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        const err = AppError.create('User not found', 404, FAIL);
        return next(err);
    }
    // Update fields if provided
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    if (!updatedUser) {
        const err = AppError.create('Failed to update user profile', 500, FAIL);
        return next(err);
    }
    
    res.status(200).json({
        status: SUCCESS,
        message: 'User profile updated successfully',
        data: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        },
    });
});

module.exports = { getUserProfile, updateUserProfile };