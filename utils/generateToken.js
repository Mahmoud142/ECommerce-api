const jwt = require('jsonwebtoken');
const generateToken = (userid) => {
    return jwt.sign({ id: userid }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

module.exports = generateToken;
