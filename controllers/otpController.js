const { sendOtp } = require("../middleware/nodemailer");
const otpModel = require("../models/otpModel");
const Otp = require("../models/otpModel");
const userModel = require("../models/userModel");
const sendOtpMail = async (req, res, next) => {
  try {
    console.log("session at sendOtpMail", req.session.user);
    await sendOtp(req.session?.user?.email);
    next();
  } catch (error) {
    console.log(error);
  }
};

const otpLoader = async (req, res) => {
  try {
    const userData = await userModel.find({ email: req.session?.user?.email });
    console.log("session at otpLoad", req.session);
    res.render("otp", { userData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const verifyOtp = async (req, res) => {
  try {
    const userInputOtp = Object.values(req.body).join("");
    console.log(userInputOtp);
    const otpData = await Otp.findOne({
      email: req.session.user.email,
    });
    if (otpData) {
      console.log("found otp db");
    }
    console.log(otpData.otp == userInputOtp);
    if (otpData.otp == userInputOtp) {
      res.json(true);
      const otpdeletion = await Otp.deleteOne({
        email: req.session.user.email,
      });
      await userModel.updateOne({email:req.session.user.email},{isVerified:true})
      if (otpdeletion) {
        console.log("otp deletion went succesfull");
      }
    } else {
      res.json(false);
    }
  } catch (error) {
    console.log(error.message);
  }
};

const resendotphandler = async (req, res) => {
  try {
    console.log("session at resendotp", req.session);
    await otpModel.deleteOne({ email: req.session.user.email });
    const data =await otpModel.find({email:req.session.user.email})
    sendOtp(req.session?.user?.email);
  } catch (error) {
    console.log(error.message);
  }
};

const forgetOtpLoader = async (req, res) => {
  try {
    res.render("forgetpasswordotp.ejs");
  } catch (error) {
    console.log(error.message);
  }
};

const forgetOtpverify = async (req, res) => {
  try {
    const userInputOtp = Object.values(req.body).join("");
    console.log(userInputOtp);
    const otpData = await Otp.findOne({
      email: req.session.forgetemail,
    });
    if (otpData.otp == userInputOtp) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (error) {
    console.log(error.message);
  }
};

// async (req, res) => {
//   try {
//     const userInputOtp = Object.values(req.body).join("");
//     console.log(userInputOtp);
//     const otpData = await Otp.findOne({
//       email: req.session.forgetemail,
//     });
//     if (otpData) {
//       console.log("found otp db");
//     }
//     console.log(otpData.otp == userInputOtp);
//     if (otpData.otp == userInputOtp) {
//       res.json(true);
//       const otpdeletion = await Otp.deleteOne({
//         email: req.session.user.email,
//       });
//       if (otpdeletion) {
//         console.log("otp deletion went succesfull");
//       }
//     } else {
//       res.json(false);
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };
module.exports = {
  sendOtpMail,
  otpLoader,
  verifyOtp,
  resendotphandler,
  forgetOtpLoader,
  forgetOtpverify,
};
