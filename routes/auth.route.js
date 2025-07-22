const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, refreshAccessToken } = require('../controllers/auth.controller');
const { validateRegister,validateLogin } = require('../middlewares/validationSchema');


router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);

module.exports = router;