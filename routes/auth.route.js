const express = require('express');
const router = express.Router();
const { signup, login} = require('../controllers/auth.controller');

const { registerValidator, loginValidator } = require('../utils/validators/auth.validator');

router.post('/register', registerValidator, signup);
router.post('/login', loginValidator, login);


module.exports = router;