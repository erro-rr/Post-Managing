const user = require('../models/userModel');
const blacklistTokenModel = require('../models/blacklistTokenModel');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const deleteUploadFilefunc = require('../helpers/deleteUploadFile');
const mailers = require('../helpers/mailers');
const jwtToken = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const userRegister = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {

      // If we found any error due to validation then delete image file which is already upload and send error status
      const filepath = path.join(__dirname, '../public/images', req.file.filename);
      await deleteUploadFilefunc(filepath);
      return res.status(400).json({
        success: false,
        Msg: "Error",
        Error: error.array()
      })
    }

    // taking parameter from request body
    const { name, email, password, mobile } = req.body;
    // console.log(req.file.filename);

    // Checking if email is already register or not
    const isUserExists = await user.findOne({ email });
    if (isUserExists) {

      // If email is aleady in db or any user is register with this email then delete the tmp image and send error status
      const filepath = path.join(__dirname, '../public/images', req.file.filename);
      await deleteUploadFilefunc(filepath);
      return res.status(400).json({
        success: false,
        msg: 'Email Already Exists',
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    // console.log('Hashed Password:', hashPassword);

    // data according to user schema
    const newUser = new user({
      name,
      email,
      password: hashPassword,
      mobile,
      image: req.file.filename,
    });

    // save data in mongo and send status 
    const userData = await newUser.save();
    const msg = `<p>Hi ${name}, please verify your email using this <a href="http://127.0.0.1:5000/API/mail-verification?id=${userData._id}">verification link</a>.</p>`;

    mailers.sendMail(email, 'Mail Verification', msg);
    return res.status(200).json({
      success: true,
      msg: 'User Registered Successfully',
      userDetails: {
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        isVerified: userData.isVerified,
        image: userData.image
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};


const userLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return res.status(400).json({
        status: false,
        errors: errors.array()
      })
    }
    else {
      const { email, password } = req.body;
      const userData = await user.findOne({ email });
      if (!userData) {
        return res.status(400).json({
          success: false,
          msg: "Invalid credentials"
        })
      }

      // checking user is verified or not

      if (userData.isVerified == 0) {
        return res.status(400).json({
          status: false,
          msg: "User is not verified"
        })
      }

      // compare password
      const matchPassword = await bcrypt.compare(password, userData.password);
      if (!matchPassword) {
        return res.status(400).json({
          success: false,
          msg: "Invalid credentials"
        })
      }
      else {

        // generate jwt token

        const accessToken = jwtToken.sign({
          id: userData._id,
          email: userData.email
        },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES

          }
        )


        const refreshToken = jwtToken.sign(
          {
            id: userData._id,
            email: userData.email
          },
          process.env.JWT_REFRESH_SECRET,
          {
            expiresIn: process.env.JWT_REFRESH_EXPIRES
          }
        )

        return res.status(200).json({
          success: true,
          msg: "Login Successfully",
          userData: userData,
          accessToken: accessToken,
          accessTokenExpiresIn: process.env.JWT_EXPIRES,
          refreshToken: refreshToken,
          refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES,
          tokenType: "Bearer"

        })
      }
    }
  }
  catch (error) {
    console.log(error);
    return res.status(400).json({
      succes: false,
      error: error
    })
  }
}

const getUserProfile = async (req, res) => {
  try {
    const UserData = await user.findById({ _id: req.user.id })
    return res.status(200).json({
      status: true,
      user: UserData
    })
  }
  catch (error) {
    return res.status(400).json({
      status: false,
      msg: "Unable to get profile data"
    })
  }

}

const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const filepath = path.join(__dirname, '../public/images', req.file.filename);
      await deleteUploadFilefunc(filepath);
      return res.status(400).json({
        status: false,
        errors: errors.array()
      })
    }
    else {
      if (req.body === undefined) {
        return res.status(400).json({
          status: false,
          msg: "Please update atleast one key value pair"
        })
      }
      const { name, mobile } = req.body;
      const data = {
        name: name,
        mobile: mobile
      }
      let oldfilepath = null
      if (req.file !== undefined) {
        data.image = req.file.filename
        const oldUser = await user.findOne({ _id: req.user.id });
        oldfilepath = path.join(__dirname, '../public/images', oldUser.image);
        // console.log(oldfilepath);
      }
      const updatedData = await user.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: data },
        { new: true }
      )

      // delete after saving new data
      if (oldfilepath) {
        await deleteUploadFilefunc(oldfilepath);
      }

      return res.status(200).json({
        status: true,
        msg: "User update Succesfully",
        data: updatedData
      })
    }
  }
  catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      msg: "Unable to update profile"
    })
  }
}
const userLogout = async (req, res) => {
  try {
    const completeToken = req.headers['authorization'];
    if (!completeToken) {
      return res.status(400).json({
        status: false,
        msg: "Invalide token"
      })
    }
    const bearerToken = completeToken.split(" ");
    const token = bearerToken[1];
    const newblacklistedtoken = new blacklistTokenModel({
      token: token
    })
    await newblacklistedtoken.save();

    return res.status(200).json({
      status: true,
      msg: "User logout sucessfully"
    })
  }
  catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      msg: "Unable to log out User"
    })
  }
}
module.exports = {
  userRegister,
  userLogin,
  getUserProfile,
  updateProfile,
  userLogout
};
