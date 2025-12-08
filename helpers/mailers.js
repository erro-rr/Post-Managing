const nodemailer = require('nodemailer');
require('dotenv').config();

// console.log("Checking env variable");
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
    }
})

// fuction to send mail
const sendMail = async (email, subject, content) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: subject,
            html: content // needed in text or html form
        };

        const info = await transporter.sendMail(mailOptions)
        console.log('Mail Sent', info.messageId);
        return info;

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    sendMail
}
