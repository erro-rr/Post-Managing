const otpModelScehma = require('../models/otpModelScehma');
const otpValidation1min = async (otpTime) => {
    try {
        const c_Time = Date.now();
        const timeDifference = (c_Time - otpTime) / (1000 * 60);
        return timeDifference > 1;
    }
    catch (error) {
        console.log(error);
    }
}


const otpValidation3min = async (otpTime) => {
    try {
        const c_Time = Date.now();
        const timeDifference = (c_Time - otpTime) / (1000 * 60);
        return timeDifference > 3;
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    otpValidation1min,
    otpValidation3min
}