


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
module.exports = { getUserProfile };