const jwt = require('jsonwebtoken');
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });
}

module.exports = { generateToken, generateRefreshToken };
