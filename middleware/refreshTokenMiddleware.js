const jwt = require('jsonwebtoken');
require('dotenv').config();

const refreshTokenMiddleware = async(req, res,next)=>{
    try{
    const completeToken = req.headers['authorization'];
    if(!completeToken){
        return res.status(400).json({
            status:false,
            msg:"Token is required"
        })
    }
    const Bearertoken = completeToken.split(" ");
    const token = Bearertoken[1];
    const decode = jwt.verify(token,process.env.JWT_REFRESH_SECRET);
    req.user = decode;
    next();
    
    }
    catch(error){
        console.log(error);
       return res.status(400).json({
            status:false,
            msg:"Invalid Token"
        })
    }

}

module.exports = refreshTokenMiddleware;