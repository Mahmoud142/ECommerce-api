const express = require('express');
const router = express.Router();
const { signup, login} = require('../controllers/auth.controller');
const { uploadUserImage, resizeUserImage } = require('../controllers/user.controller');

const { registerValidator, loginValidator } = require('../utils/validators/auth.validator');

router.post('/register', uploadUserImage, resizeUserImage, registerValidator, signup);
router.post('/login', loginValidator, login);


module.exports = router;