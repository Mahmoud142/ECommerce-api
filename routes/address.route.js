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
    .post(protect.auth,protect.allowedTo('user'),addAddress)
    .get(protect.auth,protect.allowedTo('user'),getLoggedUserAddresses)

router.route('/:addressId')
    .get(protect.auth,protect.allowedTo('user'),getAddress)
    .delete(protect.auth, protect.allowedTo('user'), deleteAddress)
    .put(protect.auth, protect.allowedTo('user'), updateAddress); // Assuming you want to update an address with the same method




module.exports = router;