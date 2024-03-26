const express = require("express");
const otpRoute = express();

const otpController = require("../controllers/otpController");
otpRoute.get("/", otpController.otpLoader);
otpRoute.post("/", otpController.verifyOtp);
otpRoute.get("/forgetpassotp", otpController.forgetOtpLoader);
otpRoute.post("/forgetpassotp", otpController.forgetOtpverify);
module.exports = otpRoute;
