const reviewModel = require("../models/reviewModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const { reviewValidationSchema } = require("../helpers/valiadator");

const getAllReviews = async (req, res) => {
  try {
    const reviewsData = await reviewModel.find({});
  } catch (error) {
    console.log(error.message);
  }
};

const CreateReview = async (req, res) => {
  try {
    console.log("create view", req.body);
    const userId = req.session.user._id;
    const productId = req.params.id;
    const rating = req.body.rating;
    const review = req.body.message;
    
    console.log(
      "create review section here",
      userId,
      productId,
      rating,
      review
    );
    // validation
    // checking whether user already wrote an review or not

    const alreadyReviewed = await reviewModel.findOne({
      userId: userId,
      productId: productId,
    });
    // console.log(alreadyReviewed);
    // if (alreadyReviewed) {
    //   return res.json("User already reviewed");
    // }

    const userData= await userModel.findOne({_id:userId});
    const eligible=userData.boughtProducts.includes(productId);
    console.log('eligible',eligible);
    if(!eligible){
      return res.json('User should by the product inorder to review ')
    }
    if(userData)
    if (!review) {
      return res.json("Review cant be submitted with null ");
    }

    // db
    const newreview = new reviewModel({
      rating: rating,
      review: review,
      userId: userId,
      productId: productId,
    });
    await newreview.save();
    // console.log("heyyyyyyyyyy");
    // console.log(newreview);
    // update rating of product
    const productReviews =await reviewModel.find({productId:productId})
    
    let totalRatings=0;
    for(const review of productReviews){
      totalRatings=totalRatings+Number(rating);
    }
    const avgRating =Math.floor(totalRatings/productReviews.length)
    // console.log(avgRating);
    // console.log('total ratingssssssssssssssssssssssssssssssssssss',totalRatings);
    // update rating to the product
    await productModel.updateOne({_id:productId},{$set:{rating:avgRating}});
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getAllReviews,
  CreateReview,
};
