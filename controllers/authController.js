const mongoose = require('mongoose');
const User = require('../models/userModel');
const otpModelSchema = require('../models/otpModelScehma');
const { message } = require('statuses');
const mailers = require('../helpers/mailers');
const { validationResult } = require("express-validator");
const randomstring = require('randomstring');
const passwordResetModel = require('../models/passwordResetModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { otpValidation1min, otpValidation3min } = require('../helpers/otpValidation');

const mailVerification = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.render('404');
    }

    /// checking if id is valid as per mongodb structure 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.render('mail-verification.ejs', {
        message: 'Invalid or corrupted verification link'
      });
    }

    const userData = await User.findById(id);

    if (!userData) {
      return res.render('mail-verification.ejs', {
        message: 'User not found'
      });
    }

    // Checking if mail is already verified or not

    if (userData.isVerified === 1) {
      return res.render('mail-verification.ejs', { message: 'Mail is already verified' });
    }

    // updating isVerified as One
    userData.isVerified = 1;
    await userData.save();

    return res.render('mail-verification.ejs', {
      message: 'Mail verified successfully'
    });

  } catch (error) {
    console.log(error.message);
    return res.render('404');
  }
};

// if anyone missed the mail somehow then we need a api to trigger it again
const sendMailVerification = async (req, res) => {
  try {
    // checking mail validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: 'Errors',
        Errors: errors.array()
      })
    }
    else {

      // Checking if mail is register or existing in our database or not
      const { email } = req.body;
      const userData = await User.findOne({ email });
      if (!userData) {
        return res.status(400).json({
          success: false,
          msg: "Email is not register"
        })
      }

      // Checking if mail is already verified or not
      if (userData.isVerified == 1) {
        return res.status(400).json({
          success: false,
          msg: userData.email + " is already verified"
        })
      }

      // Sending verification link through mail
      const msg = `<p>Hi ${userData.name}, please verify your email using this <a href="http://127.0.0.1:5000/API/mail-verification?id=${userData._id}">verification link</a>.</p>`;
      mailers.sendMail(email, 'Mail Verification', msg);
      return res.status(200).json({
        success: true,
        msg: "Verification link is send on " + userData.email
      })
    }
  }
  catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message
    })
  }
}

const forgotPassword = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: errors.array()
      })
    }

    const { email } = req.body;
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).json({
        success: false,
        msg: "Email is not registered"
      })
    }
    else {
      const randomString = randomstring.generate();
      const content = '<p>Hii ' + userData.name + ', Please click <a href = "http://127.0.0.1:5000/API/reset-password?token=' + randomString + '">here</a> to reset your password</p>';
      const resetRecord = new passwordResetModel({
        email: email,
        userId: userData._id,
        token: randomString
      });
      await resetRecord.save();
      mailers.sendMail(email, 'Password Reset', content);
      return res.status(201).json({
        success: true,
        msg: `Reset password mail sent on this ${email}`
      })
    }


  }
  catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message
    })
  }
};

const resetPassword = async (req, res) => {
  try {
    if (req.query.token == undefined) {
      return res.render('404');
    }
    const userPasswordResetData = await passwordResetModel.findOne({ token: req.query.token })
    if (!userPasswordResetData) {
      return res.render('404');
    }
    else {
      return res.render('passwordResetPage', { userPasswordResetData });
    }

  }
  catch (error) {
    console.log(error);
    return res.render('404');
  }
}


const updatePassword = async (req, res) => {
  try {
    const { reset_id, password, c_password } = req.body;
    const userPasswordResetData = await passwordResetModel.findOne({ _id: reset_id });

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.render("passwordResetPage",
        {userPasswordResetData,
        error: errors.array()[0].msg
    })
    }

    if (!userPasswordResetData) {
      return res.render("404");
    }

    // Check password match
    if (password != c_password) {
      return res.render("passwordResetPage", {
        userPasswordResetData,
        error: "Your confirm password is not matching with new password"
      });
    }

    // Validate token matches URL token
    if (userPasswordResetData.token !== req.query.token) {
      return res.render("passwordResetPage", {
        userPasswordResetData,
        error: "Invalid or expired token"
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(c_password, 10);

    //  Update user using stored userId
    await User.findByIdAndUpdate(userPasswordResetData.userId, {
      $set: {
        password: hashPassword
      }
    });

    //  Delete the reset token record
    await passwordResetModel.findByIdAndDelete(reset_id);

    return res.redirect("/API/reset-success");

  } catch (error) {
    console.log(error);
    return res.render("404");
  }
};


const resetSuccess = async (req, res) => {
  try {
    return res.render('resetSuccess.ejs');
  }
  catch (error) {
    console.log(error);
    return res.render('404');
  }
}

const refreshToken = async (req, res) => {
  try {
    const { id, email } = req.user;
    const token = jwt.sign(
      { id: id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    )

    return res.status(200).json({
      status: true,
      msg: "Access token generate Successfully!",
      token: token,
      tokenExpireIn: process.env.JWT_EXPIRES
    })
  }
  catch (error) {
    return res.status(400).json({
      status: false,
      msg: "Unable to refresh token"
    })
  }

}

// generate OTP 
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
}

// Send OTP
const sendOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        msg: "error",
        error: errors.array()
      })
    }
    else {
      const { email } = req.body;
      const userData = await User.findOne({ email: email });
      if (!userData) {
        return res.status(400).json({
          status: false,
          msg: "Email is not Register. Please check!!"
        })
      }

      if (userData.isVerified == 1) {
        return res.status(400).json({
          status: false,
          msg: "User is already verified"
        })
      }


      const otpData = await otpModelSchema.findOne({ user_id: userData._id });
      if (otpData) {
        const otpFlag = await otpValidation1min(otpData.timestamp);
        console.log(otpFlag);
        if (!otpFlag) {
          return res.status(400).json({
            status: false,
            msg: "Try again in some time !!!"
          })
        }
        else {

          const OTP = generateOTP();
          const c_time = new Date();
          await otpModelSchema.findOneAndUpdate(
            { user_id: userData._id },
            { $set: { otp: OTP, timestamp: c_time.getTime() } },
            { upsert: true, new: false, setDefaultsOnInsert: true }
          )


          // sending email
          const msg = `<p>Hi ${userData.name} <br></br> Please find your OTP for verification ${OTP}</p>`;
          mailers.sendMail(email, 'OTP for verification', msg);

          return res.status(201).json({
            status: true,
            msg: "OTP send to the register email"
          })

        }
      }

    }

  }
  catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      msg: "Unable to Send OTP"
    })
  }


}

const recieveOTPVerification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        msg: "Errors",
        Errors: errors.array()
      })
    }

    const { userID, OTP } = req.body;
    const userData = await User.findById(userID);

    if (!userData) {
      return res.status(400).json({
        status: false,
        "msg": "User is not found"
      })
    }

    if (userData.isVerified == 1) {
      return res.status(400).json({
        status: false,
        msg: "User is already verified"
      })
    }

    const otpData = await otpModelSchema.findOne({ user_id: userData._id });
    if (!otpData) {
      return res.status(400).json({
        status: false,
        msg: "OTP not found, Please request new one !!"
      })
    }
    const isOtpExpired = await otpValidation3min(otpData.timestamp);
    if (isOtpExpired) {
      return res.status(400).json({
        status: false,
        msg: "OTP is expired, It is valid for 3 minutes"
      })
    }

    const isOTPValid = Number(OTP) === otpData.otp;

    if (!isOTPValid) {
      return res.status(400).json({
        status: false,
        msg: "OTP is worong !!!"
      })
    }
    else {
      userData.isVerified = 1;
      await userData.save();
      return res.status(200).json({
        status: true,
        msg: "OTP is verified !!!"
      })

    }
  }
  catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      msg: "Unable to verify OTP"
    })
  }
}

module.exports = {
  mailVerification,
  sendMailVerification,
  forgotPassword,
  resetPassword,
  updatePassword,
  resetSuccess,
  refreshToken,
  sendOTP,
  recieveOTPVerification
};
