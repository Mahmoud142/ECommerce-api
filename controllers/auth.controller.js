const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { generateToken, generateRefreshToken } = require('../utils/generateToken');
const { SUCCESS, FAIL} = require('../utils/httpStatusText');


const refreshAccessToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ status: FAIL, message: 'No refresh token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const accessToken = generateToken(decoded.id);
        return res.status(200).json({ status: SUCCESS, token: accessToken });
    } catch (error) {
        console.error('Invalid refresh token:', error.message);
        res.status(403).json({ status: FAIL, message: 'Invalid refresh token' });
    }

}

const registerUser = async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({ status: FAIL, message: 'All fields are required' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ status: FAIL, message: 'Password must be at least 6 characters long' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ status: FAIL, message: 'Registration failed' });
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ status: FAIL, message: 'An unexpected error occurred during registration' });
    }
}


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ status: FAIL, message: "Invalid credentials" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: FAIL, message: "Invalid credentials" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ status: FAIL, message: "Invalid credentials" });
        }
        const accessToken = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        if(!refreshToken||!accessToken) {
            return res.status(500).json({ status: FAIL, message: "Failed to generate tokens" });
        }
        res.cookie('refreshToken', refreshToken, {
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ status: FAIL, message: 'An unexpected error occurred during login' });
    }
}

const logoutUser = (req, res) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(200).json({ status: SUCCESS, message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: FAIL, message: 'An error occurred during logout' });
    }
}

module.exports = { registerUser, loginUser, refreshAccessToken, logoutUser };