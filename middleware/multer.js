const multer = require("multer");
const path = require("path");
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    isProduct = Object.keys(req.body).includes("productname");
    console.log(file);
    let destinationFolder;
    
      destinationFolder = "./public/multer/products";

    cb(null, destinationFolder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
   
  },
});
module.exports = upload = multer({ storage: storage });
