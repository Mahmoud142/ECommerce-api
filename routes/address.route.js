const express = require('express');

const router = express.Router();
const {
    addAddress,
    getLoggedUserAddresses
} = require('../controllers/address.controller');
const protect = require('../middlewares/protect.middleware')


router.route('/')
    .post(protect.auth,protect.allowedTo('user'),addAddress)
    .get(protect.auth,protect.allowedTo('user'),getLoggedUserAddresses)








module.exports = router;