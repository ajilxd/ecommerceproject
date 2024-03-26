const express = require("express");
const reviewRoute = express();
const reviewController = require("../controllers/reviewController");

reviewRoute.get("/getallreviews", reviewController.getAllReviews);
reviewRoute.post("/addreview/:id", reviewController.CreateReview);

module.exports = reviewRoute;
