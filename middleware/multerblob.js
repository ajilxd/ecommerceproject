const multer = require("multer");
const path = require("path");
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    isProduct = Object.keys(req.body).includes("productname");
    console.log(file);
    let destinationFolder;

    destinationFolder = "./public/multer/categories";

    cb(null, destinationFolder);
  },
  filename: function (req, file, cb) {
    // Check if the file is a Blob
    const isBlob = file.originalname === 'blob';

    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    // Determine the appropriate file extension based on the mimetype
    let extension;
    if (isBlob) {
      // If the file is a Blob, use .jpg extension
      extension = '.jpg';
    } else {
      // Otherwise, use the original file extension
      extension = path.extname(file.originalname);
    }

    // Construct the new filename with the unique suffix and extension
    const newFilename = `${uniqueSuffix}${extension}`;

    cb(null, newFilename);
  },
});

module.exports = uploadB = multer({ storage: storage });