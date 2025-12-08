const { check,body } = require('express-validator');

exports.registerValidator = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Valid email is required').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('password', `Password must be at least 6 characters long and contain:
  - One uppercase letter
  - One lowercase letter
  - One number
  - One special character`).isStrongPassword({
        minLength: 6,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1
    }),
    check('mobile', 'Mobile no length should contains 10-12 numbers').isNumeric().isLength({
        min: 10,
        max: 12
    }),
    // check('image','Only jpg,jpeg and png image allowed').custom()
    check('image').custom((value, { req }) => {
        if (req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png' || req.file.mimetype == 'image/jpg') {
            return true;
        }
        else {
            return false;
        }
    }).withMessage('Only jpg,jpedg and png image allowed')
]

exports.sendEmailVerificationValidator = [
    check('email', 'Valid email is required').isEmail().normalizeEmail({
        gmail_remove_dots: true
    })
]

exports.passwordResetValidator = [
    check('email', 'Valid email is required').isEmail().normalizeEmail({
        gmail_remove_dots: true
    })
]

exports.userLoginValidator = [
    check('email', 'Email is required').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('password', 'Password is required').not().isEmpty()
]

exports.updateProfileValidator=[
    check('name','Name is required').optional().not().isEmpty(),
    check('mobile','Mobile no length should contains 10-12 numbers').optional().isNumeric().isLength({
        max:12,
        min:10
    })
]

exports.sendOTPValidator = [
    check('email', 'Valid email is required').isEmail().normalizeEmail({
        gmail_remove_dots: true
    })
]

exports.recieveOTPValidator = [
    check('userID','User Id is required').not().isEmpty(),
    check('OTP','Valid OTP length is 4').not().isEmpty().isNumeric().isLength({
        max:4,
        min:4
    })
]

exports.resetPasswordValidator = [
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  body("c_password")
    .notEmpty().withMessage("Confirm password is required"),
];