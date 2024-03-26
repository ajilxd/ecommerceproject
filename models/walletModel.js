const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref:'user',
    required: true
  },
  balance: {
    type: Number,
    default:0
  },
  transaction:[{
    amount:Number,
    type:String,
    date:Date,
  }]
}, {
  timestamps: true
});


const wishlistModel = mongoose.model("wallets", walletSchema);

module.exports =  wishlistModel ;
