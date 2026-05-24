const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, verifyPassResetCode, resetPassword, verify2FA, enable2FA, disable2FA, verifyEmail } = require('../controllers/auth.controller');
const { uploadUserImage, resizeUserImage } = require('../controllers/user.controller');
const protect = require('../middlewares/protect.middleware');

const { registerValidator, loginValidator, forgotPasswordValidator, verifyPassResetCodeValidator, resetPasswordValidator, verify2FAValidator, verifyEmailValidator } = require('../utils/validators/auth.validator');

router.post('/register', uploadUserImage, resizeUserImage, registerValidator, signup);
router.post('/login', loginValidator, login);
router.post('/verifyEmail', verifyEmailValidator, verifyEmail);
router.post('/forgotPassword', forgotPasswordValidator, forgotPassword);
router.post('/verifyResetCode', verifyPassResetCodeValidator, verifyPassResetCode);
router.put('/resetPassword', resetPasswordValidator, resetPassword);

// Two-Factor Authentication (2FA) Routes
router.post('/verify2fa', verify2FAValidator, verify2FA);
router.post('/enable2fa', protect.auth, enable2FA);
router.post('/disable2fa', protect.auth, disable2FA);

module.exports = router;