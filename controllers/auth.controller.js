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

    const { name, email, password, isAdmin } = req.body;
    if (!name || !email || !password) {
        const err = AppError.create('All fields are required', 400, FAIL);
        return next(err);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        const err = AppError.create('User already exists', 400, FAIL);
        return next(err);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        isAdmin: isAdmin || false
    });
    return res.status(201).json({
        status: SUCCESS,
        message: 'User registered successfully',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        }
    });
});


const loginUser = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const err = AppError.create('Invalid email or password', 400, FAIL);
        return next(err);
    }

    const user = await User.findOne({ email });
    if (!user) {
        const err = AppError.create('Invalid credentials', 404, FAIL);
        return next(err);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        const err = AppError.create('Invalid credentials', 400, FAIL);
        return next(err);
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken.push(refreshToken);
    await user.save();

    if (!refreshToken || !accessToken) {
        const err = AppError.create('Failed to generate tokens', 500, FAIL);
        return next(err);
    }

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    return res.status(200).json({
        status: SUCCESS,
        message: 'User logged in successfully',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            accessToken: accessToken
        }
    });
});

const logoutUser = (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.status(200).json({ status: SUCCESS, message: 'Logged out successfully' });

};

module.exports = { registerUser, loginUser, refreshAccessToken, logoutUser };