const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/auth.middleware');
const { getUserProfile, updateUserProfile } = require('../controllers/user.controller');


router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;