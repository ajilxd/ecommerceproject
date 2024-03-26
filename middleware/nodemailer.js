
const nodemailer = require("nodemailer");
const {otpGenerator} =require('../middleware/otpgenerator')
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.useremail,
    pass: process.env.password,
  },
});
const sendOtp =async function(email){
  console.log(otpGenerator);
  const otp = await otpGenerator(email);
  const mailOptions = {
    from: "ajilpramodone@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP for verification is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error.message);

    }
  });
}

module.exports = {sendOtp}
