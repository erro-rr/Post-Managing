const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { sendEmailVerificationValidator, passwordResetValidator,sendOTPValidator,recieveOTPValidator,resetPasswordValidator } = require('../helpers/validator')
const refreshTokenMiddleware=require('../middleware/refreshTokenMiddleware');
router.use(express.json());

router.get('/mail-verification', authController.mailVerification);
router.get('/send-mail-verification', sendEmailVerificationValidator, authController.sendMailVerification);

// use for sending mail for forgot password
router.post('/forgot-password', passwordResetValidator, authController.forgotPassword);
router.get('/reset-password', authController.resetPassword);
router.post('/reset-password',resetPasswordValidator, authController.updatePassword);
router.get('/reset-success', authController.resetSuccess);

// Authenticated Endpoints
router.get('/refresh-token',refreshTokenMiddleware,authController.refreshToken);


router.get('/send-otp',sendOTPValidator,authController.sendOTP);
router.get('/verify-otp',recieveOTPValidator,authController.recieveOTPVerification);


module.exports = router;