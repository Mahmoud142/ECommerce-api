const express = require('express');
const router = express.Router();

const protect = require('../middlewares/protect.middleware.js')
const {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    updateUserPassword,
    updateLoggedUserData,
    getLoggedUserData,
    deleteLoggedUser,
    updateLoggedUserPassword

} = require('../controllers/user.controller');

const {
    createUserValidator,
    updateUserValidator,
    getUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
    changeLoggedUserPasswordValidator,
    updateLoggedUserValidator,
} = require('../utils/validators/user.validator');

// User routes
router.get('/getMe', protect.auth, getLoggedUserData);
router.put('/changeMyPassword', protect.auth, changeLoggedUserPasswordValidator, updateLoggedUserPassword);
router.put('/updateMe', protect.auth, updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', protect.auth, deleteLoggedUser);

//Admin routes
router.route('/')
    .get(protect.auth, protect.allowedTo('admin'), getAllUsers)
    .post(protect.auth, protect.allowedTo('admin'), createUserValidator, createUser);

router.route('/:id')
    .get(protect.auth, protect.allowedTo('admin'), getUserValidator, getUser)
    .delete(protect.auth, protect.allowedTo('admin'), deleteUserValidator, deleteUser)
    .put(protect.auth, protect.allowedTo('admin'), updateUserValidator, updateUser);


router.put('/change-password/:id',
    protect.auth,
    protect.allowedTo('admin'),
    changeUserPasswordValidator,
    updateUserPassword
);
module.exports = router;