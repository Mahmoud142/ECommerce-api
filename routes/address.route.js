const express = require('express');

const router = express.Router();
const {
    addAddress
} = require('../controllers/address.controller');
const protect = require('../middlewares/protect.middleware')


router.route('/')
    .post(protect.auth,protect.allowedTo('user'),addAddress)












module.exports = router;