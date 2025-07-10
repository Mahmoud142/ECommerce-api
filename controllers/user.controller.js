const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const getUserProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error from user profile' });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Update fields if provided
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();
        if (!updatedUser) {
            return res.status(400).json({ message: 'Failed to update user profile' });
        }
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ message: 'Server error From updateUserProfile' });
    }
};

module.exports = { getUserProfile, updateUserProfile };