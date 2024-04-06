const mongoose = require("mongoose");

const ledgerBookSchema = new mongoose.Schema({
description:{
    type:String,
    required:true
},
amount:{
    type:Number,
    required:true
},
type:{
    type:String
}
},
{
    timestamps:true
})

const ledgerBookModel =mongoose.model('ledgerbook',ledgerBookSchema);
module.exports =ledgerBookModel