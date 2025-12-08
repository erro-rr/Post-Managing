const mongoose = require('mongoose');
const User = require('../models/userModel');

const otpModelSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User
    },
    otp:{
        type:Number,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now,
        required:true,
        get:(timestamp)=>timestamp.getTime(),
        set:(timestamp)=>new Date(timestamp)
    }
});

module.exports=mongoose.model("otpModelSchema",otpModelSchema);