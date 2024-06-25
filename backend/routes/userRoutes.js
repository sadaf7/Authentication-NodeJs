const express = require('express');
const { registerUser, loginUser, logoutUser, getUserDetails, updatePassword, updateUserInfo, getAllUsers, getSingleUser, deleteUser, updateUserRole } = require('../controller/userController');
const { isAuthenticated, authorizedRoles } = require('../middlwares/authMiddleware');
const router = express.Router();

router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router.route('/logout').get(logoutUser)

router.route('/me').get(isAuthenticated,getUserDetails)

router.route('/password/update').put(isAuthenticated,updatePassword)

router.route('/me/update').put(isAuthenticated,updateUserInfo)

router.route('/allUser').get(isAuthenticated,authorizedRoles('admin'),getAllUsers)

router.route('/:id').get(isAuthenticated,authorizedRoles('admin'),getSingleUser)

router.route('/:id').delete(isAuthenticated,authorizedRoles('admin'),deleteUser)

router.route('/:id').put(isAuthenticated,authorizedRoles('admin'),updateUserRole)

module.exports = router;