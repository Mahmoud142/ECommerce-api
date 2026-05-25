const express = require('express');

const router = express.Router();
const {
    addAddress,
    getLoggedUserAddresses,
    deleteAddress,
    getAddress,
    updateAddress
} = require('../controllers/address.controller');
const protect = require('../middlewares/protect.middleware')


router.route('/')
    .post(protect.auth,protect.allowedTo('user', 'admin', 'manager'),addAddress)
    .get(protect.auth,protect.allowedTo('user', 'admin', 'manager'),getLoggedUserAddresses)

router.route('/:addressId')
    .get(protect.auth,protect.allowedTo('user', 'admin', 'manager'),getAddress)
    .delete(protect.auth, protect.allowedTo('user', 'admin', 'manager'), deleteAddress)
    .put(protect.auth, protect.allowedTo('user', 'admin', 'manager'), updateAddress); // Assuming you want to update an address with the same method




module.exports = router;