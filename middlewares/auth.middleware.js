const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.log("invalid token",error);
            res.status(401).json({ status: FAIL, message: 'Not authorized, token failed' });
        }
    }
    else {
        res.status(401).json({ status: FAIL, message: 'Not authorized, no token' });
    }
}

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        console.error("Access denied: Admins only");
        res.status(401).json({ status: FAIL, message: 'Access denied: Admins only' });
    }
}
module.exports = { protect, admin };