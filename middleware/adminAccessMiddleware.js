const User = require('../models/userModel');
const onlyAdminAccess = async (req, res, next) => {
    try {
        const { id } = req.user;
        const userType = await User.findById(id);
        console.log(userType);
        if (userType.role != 1) {
            return res.status(400).json({
                status: false,
                msg: "Only admin can access"
            })
        }

        next();


    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            status: false,
            msg: "Something went wrong !!"
        })
    }
}

module.exports = onlyAdminAccess;