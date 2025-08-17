const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const AppError = require('../utils/appError');
const asyncWrapper = require('../middlewares/asyncWrapper');

//@desc Create a new user
//@route POST /api/users
//@access Private/Admin
exports.createUser = asyncWrapper(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        slug: req.body.slug,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        profileImg: req.body.profileImg,
        role: req.body.role || 'user' // default role is 'user'
    })
    user.password = undefined;
    res.status(201).json({
        status: SUCCESS,
        message: 'User created successfully',
        data: { user }
    });
})

//@desc Get all users
//@route GET /api/users
//@access Private/Admin
exports.getAllUsers = asyncWrapper(async (req, res, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 3;
    const skip = (page - 1) * limit;

    const users = await User.find({}).select('-password').skip(skip).limit(limit);
    if (!users) {
        const err = AppError.create('No users found', 404, FAIL);
        return next(err);
    }
    res.status(200).json({
        status: SUCCESS,
        page,
        length: users.length,
        message: 'Users fetched successfully',
        data: { users }
    });
})

//@desc Get a user by ID
//@route GET /api/users/:id
//@access Private/Admin
exports.getUser = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) {
        const err = AppError.create('User not found', 404, FAIL);
        return next(err);
    }
    res.status(200).json({
        status: SUCCESS,
        message: 'User profile fetched successfully',
        data: { user }
    });
});

//@desc Update a user
//@route PUT /api/users/:id
//@access Private/Admin
exports.updateUser = asyncWrapper(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            slug: req.body.slug,
            email: req.body.email,
            phone: req.body.phone,
            profileImg: req.body.profileImg,
            role: req.body.role // keep the existing role if not provided
        },
        {
            new: true, // return the updated user
            runValidators: true // validate the updated fields
        }
    )
    if (!user) {
        return next(AppError.create('User not found', 404, FAIL));
    }
    res.status(200).json({
        status: SUCCESS,
        message: 'User updated successfully',
        data: { user }
    });
});

//@desc Delete a user
//@route DELETE /api/users/:id
//@access Private/Admin
exports.deleteUser = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        const err = AppError.create('User not found', 404, FAIL);
        return next(err);
    }
    res.status(200).json({
        status: SUCCESS,
        message: 'User deleted successfully'
    });
})

//@desc Update user password
//@route PUT /api/users/:id/password
//@access Private/Admin
exports.updateUserPassword = asyncWrapper(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 10),
            passwordChangedAt: Date.now()
        },
        {
            new: true, // return the updated user
            runValidators: true // validate the updated fields
        }
    )
    if (!user) {
        return next(AppError.create('User not found', 404, FAIL));
    }
    res.status(200).json({
        status: SUCCESS,
        message: 'User password updated successfully',
        data: { user }
    });
})


//@desc Update logged-in user password
//@route PUT /api/users/changeMyPassword
//@access Private/User
exports.updateLoggedUserPassword = asyncWrapper(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id,
        {
        password: await bcrypt.hash(req.body.password, 10),
        passwordChangedAt: Date.now()
        },
        {
            new: true, // return the updated user
            runValidators: true // validate the updated fields
        })
    if (!user) {
        return next(AppError.create('User not found', 404, FAIL));
    }
    res.status(200).json({
        status: SUCCESS,
        message: 'User password updated successfully',
        data: { user }
    });
})

// Utility function to filter object properties
// This function is used to filter the fields that can be updated by the user
const filterObject = (obj, ...allowedFields) => {
    const newBodyObj = {};
    Object.keys(obj).forEach((key) => {
        if (allowedFields.includes(key)) newBodyObj[key] = obj[key];
    });
    return newBodyObj;
};

// @desc Update logged-in user data
// @route PUT /api/users/updateMe
// @access Private/Protect
exports.updateLoggedUserData = asyncWrapper(async (req, res, next) => {
    const allowedFields = filterObject(req.body, 'name', 'email', 'phone','slug');
    const user = await User.findByIdAndUpdate(req.user._id, allowedFields,
        {
            new: true, // return the updated user
            runValidators: true // validate the updated fields
        }
    )
    res.status(200).json({
        status: SUCCESS,
        message: 'User data updated successfully',
        data: { user }
    });
})

//@desc Get logged-in user profile
//@route GET /api/users/me
//@access Private/User
exports.getLoggedUserData = asyncWrapper(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
        return next(AppError.create('User not found', 404, FAIL));
    }
    res.status(200).json({
        status: SUCCESS,
        message: 'User profile fetched successfully',
        data: { user }
    });
});

//@desc Delete Logged-in user profile
//@route DELETE /api/users/deleteMe
//@access Private/User
exports.deleteLoggedUser = asyncWrapper(async (req, res, next) => {
    await User.findByIdAndDelete(req.user._id);
    res.status(204).json({
        status: SUCCESS,
        message: 'User deleted successfully'
    });
});