const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { generateToken, generateRefreshToken } = require('../utils/generateToken');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const AppError = require('../utils/appError');
const asyncWrapper = require('../middlewares/asyncWrapper');
const jwt = require('jsonwebtoken');

const refreshAccessToken = asyncWrapper(async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        const err = AppError.create('No refresh token provided', 401, FAIL);
        return next(err);
    }
    const refreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken: refreshToken });
    if (!user) {
        const err = AppError.create('Forbidden: Invalid refresh token', 403, FAIL);
        return next(err);
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err || user._id.toString() !== decoded.id) {
            const error = AppError.create('Invalid refresh token', 403, FAIL);
            return next(error);
        }
        const accessToken = generateToken(decoded.id);
        return res.status(200).json({ status: SUCCESS, token: accessToken });
    });

});

const registerUser = asyncWrapper(async (req, res, next) => {

    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        const err = AppError.create('User already exists', 400, FAIL);
        return next(err);
    }

    const user = await User.create({
        name,
        email,
        password,
        phone
    });

    const token = generateToken(user._id);

    return res.status(201).json({
        status: SUCCESS,
        message: 'User registered successfully',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            token: token,
        }
    });
});


const loginUser = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    let isPasswordMatch = false;
    if (user) {
        isPasswordMatch = await bcrypt.compare(password, user.password);
    }

    if (!user || !isPasswordMatch) {
        return next(AppError.create('Invalid credentials', 404, FAIL));
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken.push(refreshToken);
    await user.save();
    
    
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    delete user._doc.password;
    delete user._doc.refreshToken;

    return res.status(200).json({
        status: SUCCESS,
        message: 'User logged in successfully',
        data: { user, accessToken }
    });
});

const logoutUser = asyncWrapper(async (req, res, next) => {

    const cookies = req.cookies;
    if (!cookies?.jwt) {
        const err = AppError.create('No refresh token provided', 401, FAIL);
        return next(err);
    }
    const refreshToken = cookies.jwt;
    const user = await User.findOne({ refreshToken: refreshToken });
    if (user) {
        user.refreshToken = user.refreshToken.filter(token => token !== refreshToken);
        await user.save();
    }

    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.status(200).json({ status: SUCCESS, message: 'Logged out successfully' });

});

module.exports = { registerUser, loginUser, refreshAccessToken, logoutUser };