const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { generateToken, generateRefreshToken } = require('../utils/generateToken');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const AppError = require('../utils/appError');
const asyncWrapper = require('../middlewares/asyncWrapper');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

//@desc signup a new user
//@route POST /api/auth/register
//@access Public
exports.signup = asyncWrapper(async (req, res, next) => {

    const user = await User.create({
        name: req.body.name,
        slug: req.body.slug,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        profileImg: req.body.profileImg
    })

    const token = generateToken(user._id);
    res.status(201).json({ data: user, token });
});

//@desc login a user
//@route POST /api/auth/login
//@access Public
exports.login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    let isPasswordMatch = false;
    if (user) {
        isPasswordMatch = await bcrypt.compare(password, user.password);
    }

    if (!user || !isPasswordMatch) {
        return next(AppError.create('Invalid credentials', 404, FAIL));
    }

    const token = generateToken(user);
    await user.save();


    delete user._doc.password;
    return res.status(200).json({
        status: SUCCESS,
        message: 'User logged in successfully',
        data: { user, token }
    });
});
