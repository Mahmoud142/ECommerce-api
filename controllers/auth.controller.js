const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');

// Register User
const registerUser = async (req, res) => {
    const { name, email, password,isAdmin } = req.body;
    try {
        if(!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
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
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error from user register' });
    }
}

// Login User 
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({message:"Email and Password are required"});
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error from user login' });
    }
}


module.exports = { registerUser, loginUser };