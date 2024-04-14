const express = require("express");
const nocache = require("nocache");
const app = express();
const path = require("path");
require('dotenv').config();
const DB_URI=process.env.MONGODB_URI;
const SESSION_SECRET=process.env.SESSION_SECRET_KEY
app.use(express.static("public"));

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
const mongoose = require("mongoose");
mongoose.connect(DB_URI);

const morgan = require("morgan");
app.use(morgan("dev"));

const session = require("express-session");
// newwww
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(nocache());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// requiring routes
const user_route = require("./routes/userroute");
const otp_route = require("./routes/otpRoute");
const admin_route = require("./routes/adminRoute");
const profile_route = require("./routes/profileRoute");
const review_route = require("./routes/reviewRoute");

app.use("/", user_route);

app.use("/otp", otp_route);

app.use("/admin", admin_route);

app.use("/profile", profile_route);

app.use("/review", review_route);

app.listen(8000, (req, res) =>
  console.log(`Server started running at 
http://localhost:8000`)
);
