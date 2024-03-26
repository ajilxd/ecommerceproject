const express = require("express");
const profileRoute = express();
const profileController = require("../controllers/profileController");
const { isLogin, isLogout,isBlocked } = require("../middleware/auth");

profileRoute.get("/", isLogin,isBlocked, profileController.profileLoader);

module.exports = profileRoute;
