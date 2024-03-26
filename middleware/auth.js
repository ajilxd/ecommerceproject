const User = require("../models/userModel");

const isLogin = async function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    console.log("session is login", req.session);
    res.redirect("/");
  }
};

const isLogout = async function (req, res, next) {
  if (req.session.user) {
    console.log(req.session.user);
    res.redirect("/");
  } else {
    next();
  }
};

const isAdminLogin = async function (req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};

const isAdminLogout = async function (req, res, next) {
  if (req.session.admin) {
    res.redirect("/admin/home");
  } else {
    next();
  }
};

const isBlocked = async function (req, res, next) {
  const userId = req.session.user._id;
  const userDb = await User.findOne({ _id: userId });
  if (userDb.isBlocked) {
    req.session.user = null;
    res.redirect("/");
  } else {
    next();
  }
};

module.exports = {
  isAdminLogin,
  isAdminLogout,
  isLogin,
  isLogout,
  isBlocked,
};
