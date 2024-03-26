const speakeasy = require("speakeasy");
const Otp = require("../models/otpModel");

const otpGenerator = async function (email) {
  try {
    const secret = speakeasy.generateSecret({ length: 20 });
    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
    });
    const otpDB = new Otp({
      email: email,
      otp: otp,
    });
    setTimeout(function () {
      Otp.deleteMany({ email: email });
    }, 2000);
    console.log("Otp database is created");
    await otpDB.save();
    console.log(otpDB);
    return otp;
  } catch (error) {
    console.log("error at otp gen");
    console.log(error.message);
  }
};

module.exports = { otpGenerator };
