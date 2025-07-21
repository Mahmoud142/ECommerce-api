const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, refreshAccessToken } = require('../controllers/auth.controller');
const asyncWrapper = require('../middlewares/asyncWrapper');
router.post('/register', asyncWrapper(registerUser));
router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logoutUser);

module.exports = router;