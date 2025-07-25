const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, refreshAccessToken } = require('../controllers/auth.controller');

const { registerValidator, loginValidator } = require('../utils/validators/auth.validator');

router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);

module.exports = router;