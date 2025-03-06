const express = require('express');
const { handleAdminSignup, handleAdminSignin, handleAdminLogout, handleAdminForgetPassword, handleAdminResetPassword } = require('../controllers/adminController');
const upload = require("../config/cloudinaryConfig");
const router = express.Router();

router.post('/signup', upload.single("profileImageURL"),handleAdminSignup);
router.post('/signin', handleAdminSignin);
router.post('/logout', handleAdminLogout);
router.post('/forget-password', handleAdminForgetPassword);
router.post('/reset-password/:resetToken', handleAdminResetPassword);



module.exports = router;