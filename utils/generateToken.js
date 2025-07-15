const jwt = require('jsonwebtoken');
const generateToken = (userid) => {
    return jwt.sign({ id: userid }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const generateRefreshToken = (userid) => {
    return jwt.sign({ id: userid }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

module.exports = { generateToken, generateRefreshToken };
