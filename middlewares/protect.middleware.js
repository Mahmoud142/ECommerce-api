const asyncWrapper = require('../middlewares/asyncWrapper');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const {SUCCESS, FAIL} = require('../utils/httpStatusText');
// make sure that the user is logged in
exports.auth = asyncWrapper(async (req, res, next) => {
    // get token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return next(AppError.create('You are not logged in', 401, FAIL));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user by id
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(AppError.create('User not found', 404, FAIL));
    }

    // check if user changed password after token was issued
    if (currentUser.passwordChangedAt) {
        const passChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
        if (decoded.iat < passChangedTimestamp) {
            return next(AppError.create('User recently changed password! Please log in again', 401, FAIL));
        }
    }
    // console.log('currentUser', currentUser);
    delete currentUser._doc.password;
    req.user = currentUser;
    // console.log("I am here auth middleware and this is the req.user", req.user);
    next();
})

// make sure that the user is logged in and has the right role
exports.allowedTo = (...roles) => {
    return asyncWrapper(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                status: FAIL,
                message: `Role ${req.user.role} is not allowed to access this route`
            });
        }
        next();
    })
}