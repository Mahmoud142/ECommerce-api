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
//done
router.get('/getMe', protect.auth, getLoggedUserData);
router.put('/changeMyPassword', protect.auth, changeLoggedUserPasswordValidator, updateLoggedUserPassword);
router.put('/updateMe', protect.auth, updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', protect.auth, deleteLoggedUser);

// // Admin routes
//done
router.get('/', protect.auth, protect.allowedTo('admin'), getAllUsers);
router.get('/:id', protect.auth, protect.allowedTo('admin'), getUserValidator, getUser);
router.post('/', protect.auth, protect.allowedTo('admin'), createUserValidator, createUser);
router.delete('/:id', protect.auth, protect.allowedTo('admin'), deleteUserValidator, deleteUser);
router.put('/change-password/:id', protect.auth, protect.allowedTo('admin'), changeUserPasswordValidator, updateUserPassword);
router.put('/:id', protect.auth, protect.allowedTo('admin'), updateUserValidator, updateUser);
module.exports = router;