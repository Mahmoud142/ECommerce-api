const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/auth.middleware');
const { getUserProfile } = require('../controllers/user.controller');


router.get('/profile', protect, getUserProfile);


module.exports = router;