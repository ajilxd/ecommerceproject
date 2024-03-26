const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const addressModel = require("../models/addressModel");
const walletModel =require("../models/walletModel")
const profileLoader = async (req, res) => {
  try {
    const orderData = await orderModel.find({ userId: req.session.user._id }).sort({createdAt:-1});

    const addressData = await addressModel.find({
      userId: req.session.user._id,
    });
    const walletData = await walletModel.findOne({userId:req.session.user._id});
    const userData = await userModel.findOne({ _id: req.session.user._id });
    // console.log("profileeeeeee", userData);
    res.render("userprofile", {
      userData,
      orderData: orderData,
      addressData,
      walletData
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { profileLoader };
