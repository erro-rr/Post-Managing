const jwt = require('jsonwebtoken');
require('dotenv').config();
const blacklistTokenModel = require('../models/blacklistTokenModel');

const tokenVerification = async (req, res, next) => {
    try {
        const completeToken = req.headers['authorization'];
        if (!completeToken) {
           return res.status(401).json({
                status: false,
                msg: "Token is required"
            })
        }
        const completeTokenSplitted = completeToken.split(" ");
        const token = completeTokenSplitted[1];
        const isTokenBlacklisted = await blacklistTokenModel.findOne({token:token});
        if(isTokenBlacklisted){
           return res.status(400).json({
                status:false,
                msg:"User already logout"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
       return res.status(400).json({
            status: false,
            msg: "Invalid token"
        })
    }
}

module.exports = tokenVerification;