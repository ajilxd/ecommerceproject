const puppeteer = require('puppeteer');
const xlsx= require('xlsx')
const adminModal = require("../models/adminModel");
const { categorySchema, productSchema,couponSchema,offerSchema} = require("../helpers/valiadator");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const requestModel = require("../models/userRequestsModel");
const notificationModel = require("../models/notificationModel");
const reviewModel = require("../models/reviewModel");
const { request } = require("express");
const CouponModel = require("../models/couponModel");
const offerModel =require("../models/offerModel");
const walletModel=require("../models/walletModel");
const ledgerBookModel =require("../models/ledgerbookmodel");
const ExcelJS =require('exceljs');
const adminLoginLoader = async (req, res) => {
  try {
    res.render("adminlogin");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyAdminLogin = async (req, res) => {
  try {
    console.log(req.body);
    const adminDb = await adminModal.findOne({});
    console.log(adminDb);
    const adminPassword = adminDb.password;
    const inputPassword = req.body.password;
    if (adminPassword == inputPassword) {
      req.session.admin = adminDb;
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (error) {
    console.log(error.message);
  }
};

// pageloaders here

const adminHomeLoader = async (req, res) => {
  try {
    const monthlyData =await  orderModel.aggregate([
    
      {
        $group: {
          _id: { $month: new Date() },
          totalSales: { $sum: 1 },
          totalSalesAmount: { $sum: "$orderAmount" },
          totalOfferDiscount: { $sum: "$offerDiscount" },
          totalCouponDiscount:{$sum:"$couponDiscount"}
        }
      }
      
    ])
    const overallData = await orderModel.aggregate([
      {
        $group: {
          _id: "",
          totalSales: { $sum: 1 }, 
          totalSalesAmount: { $sum: "$orderAmount" }, 
          totalOfferDiscount: { $sum: "$offerDiscount" }, 
          totalCouponDiscount: { $sum: "$couponDiscount" } 
        }
      }
    ])

    const toptenproducts = await orderModel.aggregate([
      { 
        $unwind: "$orderedItems" 
      },
      {
        $group: {
          _id: "$orderedItems.productname",
          count: { $sum: "$orderedItems.quantity" }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    const toptencategories = await orderModel.aggregate([
      { 
        $unwind: "$orderedItems" 
      },
      {
        $group: {
          _id: "$orderedItems.category",
          count: { $sum: "$orderedItems.quantity" }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const toptenbrands = await orderModel.aggregate([
      { 
        $unwind: "$orderedItems" 
      },
      {
        $group: {
          _id: "$orderedItems.brand",
          count: { $sum: "$orderedItems.quantity" }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    

    const totalOrders=await orderModel.find({}).countDocuments();
    const monthsalesrevenue =monthlyData[0].totalSalesAmount;
    const totalsales=overallData[0].totalSales;
    const totalproductscount = await productModel.find({}).countDocuments();
    const totalcategorycount =await categoryModel.find({}).countDocuments();
    const totalrevenue=overallData[0].totalSalesAmount
    // console.log(totalproductscount ,'total no of products');
    // console.log(monthsalesrevenue,'monthly sales amount');
    // console.log(overallData[0].totalSales,'total sales')
    console.log(toptenbrands);
    res.render("adminhome",{monthsalesrevenue,totalsales,totalproductscount,totalrevenue,totalOrders,totalcategorycount,toptencategories,toptenproducts,toptenbrands });
  } catch (error) {
    console.log(error);
  }
};

const addProductsLoader = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.render("addproduct", { category });
  } catch (error) {
    console.log(error.message);
  }
};

const categoriesLoader = async (req, res) => {
  try {
    res.render("categories");
  } catch (error) {
    console.log(error.message);
  }
};

const ordersLoader = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;   
    
    const totalCount = await  orderModel.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    console.log('Total no of pages are ',totalPages);
    const orderData = await orderModel.find({}).populate("userId").sort({createdAt:-1}).skip(skip).limit(limit);
    const cancelData = await requestModel
      .find({ isCancel: true })
      .populate("userId");
    const returnData = await requestModel
      .find({ isReturn: true })
      .populate("userId");
    res.render("orders", { orderData, cancelData, returnData,totalPages});
  } catch (error) {
    console.log(error.message);
  }
};

const reviewsLoader = async (req, res) => {
  try {
    res.render("reviews");
  } catch (error) {
    console.log(error.message);
  }
};

const transactionsLoader = async (req, res) => {
  try {
    res.render("transaction");
  } catch (error) {
    console.log(error.message);
  }
};

// add product post request handling

const addProductDb = async (req, res) => {
  try {
    // validation

    const {
      price,
      cost,
      color,
      size,
      brand,
      description,
      productname,
      status,
      categories,
      quantity,
    } = req.body;
    console.log("categoryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy", categories);
    const imagePaths = req.files.map((i) => i.filename);
    console.log(req.body);
    try {
      await productSchema.validateAsync(req.body); //joi validation
    } catch (error) {
      console.log("hii error");
      console.log(error.message);
      return res.json(error.message);
    }
    const existingproduct = await productModel.findOne({
      productName: productname,
    });

    if (imagePaths.length < 1) {
      return res.json("emptyfiles");
    } else if (Number(price) < Number(cost)) {
      return res.json("lowprice");
    } else if (imagePaths.length < 4) {
      return res.json("less");
    } else if (existingproduct) {
      return res.json("Existing product name");
    }

    // storing in db
    const productData = new productModel({
      productName: productname,
      price: price,
      cost: cost,
      size: size,
      brand: brand,
      description: description,
      color: color,
      status: status,
      image: imagePaths,
      categoryId: categories,
      quantity: quantity,
      originalPrice:price
    });
    await productData.save();
    // ledger book entry
    const overallProductCostForLedgerEntry=cost*quantity;
    const descriptionForLedgerEntry=`${productname} with ${quantity} quantity has been added to the stock`;
    const ledgerType ='expense';
    await ledgerBookModel.create({description:descriptionForLedgerEntry,amount:overallProductCostForLedgerEntry,type:ledgerType})
    res.json(true);
  } catch (error) {
    console.log(error);
  }
};

// category section
const loadAddCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.render("categories", { categories });
  } catch (error) {
    console.log(error.message);
  }
};
const addCategoryDb = async (req, res) => {
  try {
    console.log("addcat", req.body);
    try {
      await categorySchema.validateAsync(req.body);
    } catch (error) {
      res.json(error.message);
    }

    const existingcategory = await categoryModel.findOne({
      categoryName: req.body.categoryname,
    });
    if (existingcategory) {
      return res.json("existing category name");
    }
    const categoryData = new categoryModel({
      categoryName: req.body.categoryname,
      status: req.body.status,
      description: req.body.description,
    });
    const data = await categoryData.save();
    res.json(true);
  } catch (error) {
    console.log("error at add category", error.message);
  }
};

const editcategoryDb = async (req, res) => {
  try {
    const categoryid = req.params.id;
    console.log(req.body);
    const { categoryname, description, status } = req.body;

    try {
      await categorySchema.validateAsync(req.body);
    } catch (error) {
      return res.json(error.message);
    }

    const existingcategory = await categoryModel.findOne({
      categoryName: req.body.categoryname,
    });
    console.log(existingcategory);
    if (existingcategory) {
      return res.json("Existing category");
    }
    await categoryModel.updateOne(
      { _id: categoryid },
      {
        $set: {
          categoryName: categoryname,
          description: description,
          status: status,
        },
      }
    );
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

// product dashboard admin

const productsLoader = async (req, res) => {
  try {
    const productData = await productModel.find({});
    const category = await categoryModel.find({});
    res.render("products", { productData, category });
  } catch (error) {
    console.log(error.message);
  }
};

// edit

const editProduct = async (req, res) => {
  try {
    console.log("edit product");
    const productId = req.params.id;
    const category = await categoryModel.find({});
    const productData = await productModel.findOne({ _id: productId });
    res.render("editproduct", { productData, category });
  } catch (error) {
    console.log(error.message);
  }
};

const editProductDb = async (req, res) => {
  try {
    
    const {
      price,
      cost,
      description,
      brand,
      status,
      productname,
      color,
      size,
      categories,
      quantity,
    } = req.body;
    // console.log("body ",req.body);
     console.log("files",req.files)
    const productId = req.params.id;
    const productFromDatabase=await productModel.findOne({_id:productId});
    // console.log(productFromDatabase)
    let imagePath;
    imagePath=productFromDatabase.image
    if(req.files.length<1){
      console.log('hiiiii no images ');
      imagePath=productFromDatabase.image
    }else{
      req.files.map((i,index) =>imagePath[index]=i.mimetype=='image/png'? i.filename:productFromDatabase.image[index]);
    }
    console.log(imagePath);
    
   
   
    try {
      await productSchema.validateAsync(req.body);
    } catch (error) {
      return res.json(error.message);
    }

    await productModel.updateOne(
      { _id: productId },
      {
        $set: {
          productName: productname,
          price: price,
          cost: cost,
          description: description,
          brand: brand,
          status: status,
          color: color,
          size: size,
          image: imagePath,
          categoryId: categories,
          quantity: quantity,
        },
      }
    );
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const userLoader = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.render("users", { users });
  } catch (error) {
    console.log(error.message);
  }
};

const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await userModel.findByIdAndUpdate(
      { _id: userId },
      { $set: { isBlocked: true } }
    );
    console.log(`${userData.name} has been succesfully blocked`);
    res.json(true);
  } catch (error) {
    console.log("error at blocking user");
    console.log(error.message);
  }
};
const unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await userModel.findByIdAndUpdate(
      { _id: userId },
      { $set: { isBlocked: false } }
    );
    console.log(`${userData.name} has been succesfully unblocked`);
    res.json(true);
  } catch (error) {
    console.log("error at unblocking user");
    console.log(error.message);
  }
};

const orderDetailsLoader = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderData = await orderModel
      .findOne({ orderId: orderId })
      .populate("userId")
      .populate("deliveryAddress");
    res.render("orderdetails", { orderData });
  } catch (error) {
    console.log(error.message);
  }
};

const orderStatusUpdate = async (req, res) => {
  try {
    console.log(req.body);
    const { selectedValue, orderId } = req.body;
    const orderData = await orderModel.updateOne(
      { orderId: orderId },
      { status: selectedValue }
    );
    console.log(orderData);
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const logoutAdminhandler = async (req, res) => {
  try {
    req.session.admin = null;
    res.redirect("/admin/login");
  } catch (error) {
    console.log(error.message);
  }
};

const logOutAdmin = async (req, res) => {
  try {
    req.session.admin = null;
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const cancelApprovedHandler = async (req, res) => {
  try {
    console.log('Request for cancel order received')
    const { orderId, requestId, userId } = req.body;
    await orderModel.updateOne(
      { orderId: orderId },
      { $set: { status: "Cancelled" } }
    );
    await requestModel.deleteOne({ _id: requestId });
    await notificationModel.updateOne(
      { userId: userId },
      {
        $push: {
          messages: `#${orderId} has been successfully cancelled`,
        },
      },
      {
        upsert: true,
      }
    );
    const orderDataBase = await orderModel.findOne({
      orderId:orderId});
    console.log('order',orderDataBase)
    console.log(orderDataBase.payment);
    if(orderDataBase.payment=='online'){
    const walletDataBase = await walletModel.findOne({userId:userId});
    console.log(walletDataBase);
    const wallettranscation=
    {
      amount:orderDataBase.orderAmount,
      mode:'Credit',
      date:Date.now(),
    }
    if(walletDataBase){
    
      const updatedb=await walletModel.updateOne({userId:userId},{balance:walletDataBase.balance+orderDataBase.orderAmount,$push:{transaction:wallettranscation}
      },{upsert:true});
      console.log(updatedb);
    }else{
      const updatedb=await walletModel.updateOne({userId:userId},{balance:orderDataBase.orderAmount,$push:{transaction:wallettranscation}
      },{upsert:true})
      console.log(updatedb);
    }

   // ledger book entry
   let loss=0
   orderDataBase.orderedItems.map(i=>{
     loss+=i.price
   })
   const ledgerEntryType=`expense`
   const ledgerEntryDescription=`loss ${loss} maded with order  cancelling of #${orderId}`
   await ledgerBookModel.create({type:ledgerEntryType,description:ledgerEntryDescription,amount:loss});
    
    }else if(orderDataBase.payment=='wallet'){
      
      const walletDataBase = await walletModel.findOne({userId:userId});
      console.log(walletDataBase);
      const wallettranscation=
      {
        amount:orderDataBase.orderAmount,
        mode:'Credit',
        date:Date.now(),
      }
      if(walletDataBase){
      
        const updatedb=await walletModel.updateOne({userId:userId},{balance:walletDataBase.balance+orderDataBase.orderAmount,$push:{transaction:wallettranscation}
        },{upsert:true});
        console.log(updatedb);
      }else{
        const updatedb=await walletModel.updateOne({userId:userId},{balance:orderDataBase.orderAmount,$push:{transaction:wallettranscation}
        },{upsert:true})
        console.log(updatedb);
      }
      // ledger book entry
     let loss=0
     orderDataBase.orderedItems.map(i=>{
       loss+=i.price
     })
     const ledgerEntryType=`expense`
     const ledgerEntryDescription=`loss ${loss} maded with order  cancelling of #${orderId}`
     await ledgerBookModel.create({type:ledgerEntryType,description:ledgerEntryDescription,amount:loss});
    }
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const cancelDiscardHandler = async (req, res) => {
  try {
    console.log(req.body);
    const { requestId } = req.body;
    await requestModel.deleteOne({ _id: requestId });
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const returnApprovedHandler = async (req, res) => {
  try {
    console.log(req.body);
    const { orderId, requestId, userId } = req.body;
    await orderModel.updateOne(
      { orderId: orderId },
      { $set: { status: "Returned" } }
    );
    const orderDataBase = await orderModel.findOne({
      orderId:orderId});
      const wallettranscation=
      {
        amount:orderDataBase.orderAmount,
        mode:'Credit',
        date:Date.now(),
      }
    const walletDataBase = await walletModel.findOne({userId:userId})
    await walletModel.updateOne({userId:userId},{balance:walletDataBase.balance+orderDataBase.orderAmount,$push:{transaction: wallettranscation}
    },{upsert:true})
    await requestModel.deleteOne({ _id: requestId });
    await notificationModel.updateOne(
      { userId: userId },
      {
        $push: {
          messages: `#${orderId} has been successfully approved for return`,
        },
      },
      {
        upsert: true,
      }
    );
    // ledger book entry
    let loss=0
    orderDataBase.orderedItems.map(i=>{
      loss+=i.price
    })
    const ledgerEntryType=`expense`
    const ledgerEntryDescription=`loss ${loss} maded with order with returning of #${orderId}`
    await ledgerBookModel.create({type:ledgerEntryType,description:ledgerEntryDescription,amount:loss});
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const returnDiscardHandler = async (req, res) => {
  try {
    console.log(req.body);
    const { orderId, requestId } = req.body;
    await requestModel.deleteOne({ _id: requestId });
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const loadReviews = async (req, res) => {
  try {
    const reviewData = await reviewModel
      .find({})
      .populate("userId")
      .populate("productId");
    console.log(reviewData);
    res.render("reviews", { reviewData });
  } catch (error) {
    console.log(error.message);
  }
};

const couponsLoader =async(req,res)=>{
  try{
    const allCoupons = await CouponModel.find({})
    res.render('coupons',{couponData:allCoupons})
  }catch(error){
    console.log(error.message)
  }
}

const addCoupon = async(req,res) =>{
  try{
    res.render('addcoupon')
  }catch(error){
    console.log(error.message)
  }
}

const addCouponDb = async(req,res)=>{
  try{
    console.log(req.body);
    const {name,code,status,limit,expiryDate,discountAmount, criteriaAmount}= req.body;
    try{ 
       await couponSchema.validateAsync(req.body);
    }catch(error){
       return res.json(error.message)
    }
    if(Number(discountAmount)>=Number(criteriaAmount)){
      console.log({discountAmount,criteriaAmount})
      return res.json('discount amount should be lower than criteria amount');
    }

    const inputDate =new Date(expiryDate);
    const currentDate = new Date(Date.now());
    if(inputDate.getTime() <= currentDate.getTime()){
      return res.json('enter a valid expiry date');
    }
    const couponData =  new CouponModel({
      name:name,
      code:code,
      status:status,
      limit:limit,
      expiryDate:expiryDate,
      discountAmount:discountAmount,
      criteriaAmount:criteriaAmount
    })
    
    await couponData.save();
   
    res.json(true);
  }catch(error){
    console.log(error.message)
  }
}

const editCouponLoader = async (req,res)=>{
  try{
    console.log(req.params);
    const couponId =req.params.id;
    const couponData =await CouponModel.findOne({_id:couponId})
    res.render('editcoupon',{couponData})
  }catch(error){
    console.log(error.message)
  }
}

const editCouponDb =async (req,res)=>{
  try{
    const couponId=req.params.id;
   
    const {name,code,status,limit,expiryDate,discountAmount, criteriaAmount}= req.body;
    // validation
   
    try{ 
       await couponSchema.validateAsync(req.body);
    }catch(error){
       return res.json(error.message)
    }
    if(Number(discountAmount)>=Number(criteriaAmount)){
      console.log({discountAmount,criteriaAmount})
      return res.json('discount amount should be lower than criteria amount');
    }
    const inputDate =new Date(expiryDate);
    const currentDate = new Date(Date.now());
    if(inputDate.getTime() <= currentDate.getTime()){
      return res.json('enter a valid expiry date');
    }
    await CouponModel.updateOne({_id:couponId},{$set:{
      name,code,status,limit,expiryDate,discountAmount,criteriaAmount
    }})
    res.json(true);
  }
  catch(error){
    console.log(error.message)
  }
}

const addofferload =async (req,res)=>{
  try{
    const categoryData = await categoryModel.find({});
    const productData = await productModel.find({});
    res.render('addoffers',{categoryData,productData});
  }catch(error){
    console.log(error.message)
  }
}

//add offer in db

const offerDb = async (req,res)=>{
  try{
    console.log(req.body);
   const {name,status,discountpercentage,expirydate,description,category,type,product} = req.body;
  //  validation
   try{
    await offerSchema.validateAsync(req.body);
   }
   catch(error){
   return res.json(error.message);
   }
   const inputDate =new Date(expirydate);
    const currentDate = new Date(Date.now());
    if(inputDate.getTime() <= currentDate.getTime()){
      return res.json('enter a valid expiry date');
    }




  // checking offer name is taken or not
  const existing= await offerModel.findOne({name});
  if(existing){
    return res.json("Existing offer name");
  }
   const imagePath=req.file.filename;
   const offerData =new offerModel({
    name,status,discountpercentage,expirydate,description,category,image:imagePath,type,product
   })
   await offerData.save();
  //  finding offer id 
  const offerDb=await offerModel.findOne({name:name});
  // based on type ,update product
  if(type=='category'){
   
    console.log(category);
    // await productModel.updateMany({categoryId:category},{$set:{originalprice:2000}})
    
   const newproductdata= await productModel.findOneAndUpdate(
      { categoryId: category },
      { $set: {  categoryOfferId:offerDb._id } }
    );
    const categoryProducts = await productModel.find({ categoryId: category})
    categoryProducts.map(i=>{
     

      const updatepricebycategoryoffer= async function(i){
      await productModel.updateOne({_id:i._id},{$set:{price:Math.floor(i.price-(i.price*discountpercentage/100)), categoryDiscount:discountpercentage}})
       }

    updatepricebycategoryoffer(i);

    })

    
  }else if(type=='product'){
    console.log('product offer handler here')
    const productdata=await productModel.findOne({_id:product})
    const newproductdata= await productModel.findOneAndUpdate(
      { _id:product},
      { $set: {  productOfferId:offerDb._id,price:Math.floor(productdata.price-(productdata.price*discountpercentage/100)),productDiscount:discountpercentage } }
    );
    
      console.log(newproductdata);

  }
   res.json(true);
  }catch(error){
    console.log(error.message)
  }
}

const alloffersloader = async(req,res)=>{
  try{
    const offerData = await offerModel.find({});
    res.render('alloffers',{offerData})
  }catch(error){
    console.log(error.message)
  }
}






const removeOfferHandler=async (req,res)=>{
  try{
    const offerid= req.params.id;
    const type =req.body.type;
    console.log('removeoffer');
    if(type=='category'){
      console.log('ima category');
      const productOfCategoryOffers = await productModel.find({categoryOfferId:offerid});
      productOfCategoryOffers.map(i=>{
        discount=i.categoryDiscount;
        const updatePriceByRemoveCategoryOffer= async function(i){
        await productModel.updateOne({_id:i._id},{price:Math.floor(i.price+i.originalPrice*(discount/100)),categoryDiscount:0,categoryOfferId:null})
        }
        updatePriceByRemoveCategoryOffer(i);
      })
    }else if(type=='product'){
        const product = await productModel.findOne({productOfferId:offerid});
        console.log(product);
        const discount =product.productDiscount;
        console.log('pp',product.price,'pop',product.originalPrice*(discount/100))
        await productModel.updateOne({_id:product._id},{price:Math.floor(product.price+product.originalPrice*(discount/100)),productDiscount:0,productOfferId:null})
        
    }
    // update offer status to inactive
    await offerModel.updateOne({_id:offerid},{status:'inactive'})
    res.json(true);
  }catch(error){
    console.log(error.message)
  }
}

//reactivate offer
const reactivateOfferHandler = async (req,res)=>{
  try{
    const offerId = req.params.id;
    const offerData =await offerModel.findOne({_id:offerId})
    const type=offerData.type;
    if(type=='category'){
   
     
      
     const newproductdata= await productModel.findOneAndUpdate(
        { categoryId:offerData.category },
        { $set: {  categoryOfferId:offerData._id } }
      );
      const categoryProducts = await productModel.find({ categoryId:offerData.category })
      categoryProducts.map(i=>{
       
  
        const reupdatePriceByCategoryOffer= async function(i){
        await productModel.updateOne({_id:i._id},{$set:{price:Math.floor(i.price-(i.price*offerData.discountpercentage/100)), categoryDiscount:offerData.discountpercentage}})
         }
  
         reupdatePriceByCategoryOffer(i);
  
      })
  
      
    }else if(type=='product'){
      const product = await productModel.findOne({ _id:offerData.product});
      const newproductdata= await productModel.findOneAndUpdate(
        { _id:offerData.product },
        { $set: {  productOfferId:offerData._id,price:Math.floor(product.price-(product.price*offerData.discountpercentage/100)),productDiscount:offerData.discountpercentage } }
      );
      console.log(newproductdata);
    }
     // update offer status to inactive
     await offerModel.updateOne({_id:offerId},{status:'active'})
    
     res.json(true);
  }catch(error){
    console.log(error.message);
  }
}



const salesReportLoader = async (req,res)=>{
  try{
    const orderData = await orderModel.find({}).populate('userId').populate('couponId').populate('offers');

    // weekly sales data
   const weeklyData =await  orderModel.aggregate([
    
      {
        $group: {
          _id: { $week: "$createdAt" },
          totalSales: { $sum: 1 },
          totalSalesAmount: { $sum: "$orderAmount" },
          totalOfferDiscount: { $sum: "$offerDiscount" },
          totalCouponDiscount:{$sum:"$couponDiscount"}
        }
      },
      { $sort: { _id: 1 } }
    ])
    // monthly sales data
    const monthlyData =await  orderModel.aggregate([
    
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: 1 },
          totalSalesAmount: { $sum: "$orderAmount" },
          totalOfferDiscount: { $sum: "$offerDiscount" },
          totalCouponDiscount:{$sum:"$couponDiscount"}
        }
      },
      { $sort: { _id: 1 } }
    ])
    // daily sales data
    const dailyData = await orderModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: 1 },
          totalSalesAmount: { $sum: "$orderAmount" },
          totalOfferDiscount: { $sum: "$offerDiscount" },
          totalCouponDiscount: { $sum: "$couponDiscount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])
  //  yearlyData


  const yearlyData =await  orderModel.aggregate([
    
    {
      $group: {
        _id: { $year: "$createdAt" },
        totalSales: { $sum: 1 },
        totalSalesAmount: { $sum: "$orderAmount" },
        totalOfferDiscount: { $sum: "$offerDiscount" },
        totalCouponDiscount:{$sum:"$couponDiscount"}
      }
    },
    { $sort: { _id: 1 } }
  ])

  // overall stats

  const overallData = await orderModel.aggregate([
    {
      $group: {
        _id: "",
        totalSales: { $sum: 1 }, 
        totalSalesAmount: { $sum: "$orderAmount" }, 
        totalOfferDiscount: { $sum: "$offerDiscount" }, 
        totalCouponDiscount: { $sum: "$couponDiscount" } 
      }
    }
  ])
  
    res.render('salesreport',{orderData,dailyData,monthlyData,yearlyData,overallData,weeklyData});
  }catch(error){
    console.log(error.message)
  }
}


const pdfGenerator = async (req, res) => {
  try {
    console.log(req.body);
    const { html } = req.body;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Fetch Bootstrap CSS from CDN
    const bootstrapCSS = await fetch('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css')
      .then(res => res.text());

    // Inject Bootstrap CSS into HTML content
    const htmlWithBootstrap = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${bootstrapCSS}</style>
      </head>
      <body>
        ${html} <!-- Your existing HTML content -->
      </body>
      </html>
    `;

    // Set HTML content and generate PDF
    await page.setContent(htmlWithBootstrap, { waitUntil: 'load' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    res.set('Content-Type', 'application/pdf');
    res.send(pdf);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error generating PDF');
  }
}


const excelGenerator = async (req, res) => {
  try {
    const { html } = req.body;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
   

    // Extract data from HTML
    const data = await page.evaluate(() => {
      const orderData = [];
      const table = document.querySelector('.table-responsive table');
      const tableRows = table.querySelectorAll('tbody tr');

      tableRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        const offers = Array.from(cells[4].querySelectorAll('li')).map(li => li.textContent.trim());
        const rowData = {
          OrderId: cells[0].textContent.trim(),
          Name: cells[1].textContent.trim().replace(/<\/?b>/g, ''),
          Price: parseFloat(cells[2].textContent.trim()),
          Coupon: cells[3].textContent.trim(),
          Offers:  cells[4].textContent.trim(),
          TotalDiscount: parseFloat(cells[5].textContent.trim()),
          Date: Date(cells[6].textContent.trim()),
          Status: cells[7].textContent.trim(),
          PaymentMode: cells[8].textContent.trim(),
        };
        orderData.push(rowData);
      });

      return orderData;
    });

    await browser.close();

    // Convert data to Excel using xlsx
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate Excel file buffer
    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Set response headers and send the Excel file
    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.set('Content-Disposition', 'attachment; filename="report.xlsx"');
    res.send(excelBuffer);
  } catch (error) {
    console.log(error.message);
  }
};

// custom date sales report
const customsalesreport =async (req,res)=>{
  try{
    let fromDate = req.body.from; // Replace with your desired from date
    let toDate = req.body.to; // Replace with your desired to date
    fromDate=new Date(fromDate);
    toDate=new Date(toDate);
    console.log({fromDate,toDate})
    orders = await orderModel.find({createdAt: {$gte:fromDate, $lte:toDate}}).populate('userId').populate('couponId').populate('offers');
    console.log(orders)
    res.json(orders);
  }catch(error){
    console.log(error.message)
  }
}

const generateExcelExportWeekly =async(req,res)=>{
  try{
    const weeklyData =await  orderModel.aggregate([
    
      {
        $group: {
          _id: { $week: "$createdAt" },
          totalSales: { $sum: 1 },
          totalSalesAmount: { $sum: "$orderAmount" },
          totalOfferDiscount: { $sum: "$offerDiscount" },
          totalCouponDiscount:{$sum:"$couponDiscount"}
        }
      },
      { $sort: { _id: 1 } }
    ])
     // Create a new Excel workbook
     const workbook = new ExcelJS.Workbook();
     const worksheet = workbook.addWorksheet('Sheet 1');
 
     // Add headers
     const headers = Object.keys( weeklyData[0]);
     worksheet.addRow(headers);
 
     // Add data rows
     weeklyData.forEach(item => {
         const values = Object.values(item);
         worksheet.addRow(values);
     });
 
     // Set response headers
     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
     res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');

     workbook.xlsx.write(res)
     .then(() => {
         res.end();
     })
     .catch(err => {
         console.error('Error generating Excel:', err);
         res.status(500).send('Error generating Excel');
     });
 
  }catch(error){
    console.log(error);
  }
}

const generateExcelExportMonthly =async(req,res)=>{
  try{
    const monthlyData =await  orderModel.aggregate([
    
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: 1 },
          totalSalesAmount: { $sum: "$orderAmount" },
          totalOfferDiscount: { $sum: "$offerDiscount" },
          totalCouponDiscount:{$sum:"$couponDiscount"}
        }
      },
      { $sort: { _id: 1 } }
    ])
     // Create a new Excel workbook
     const workbook = new ExcelJS.Workbook();
     const worksheet = workbook.addWorksheet('Sheet 1');
 
     // Add headers
     const headers = Object.keys( monthlyData[0]);
     worksheet.addRow(headers);
 
     // Add data rows
     monthlyData.forEach(item => {
         const values = Object.values(item);
         worksheet.addRow(values);
     });
 
     // Set response headers
     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
     res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');

     workbook.xlsx.write(res)
     .then(() => {
         res.end();
     })
     .catch(err => {
         console.error('Error generating Excel:', err);
         res.status(500).send('Error generating Excel');
     });
 
  }catch(error){
    console.log(error);
  }
}

const generateExcelExportYearly =async(req,res)=>{
  try{
    const yearlyData =await  orderModel.aggregate([
    
      {
        $group: {
          _id: { $year: "$createdAt" },
          totalSales: { $sum: 1 },
          totalSalesAmount: { $sum: "$orderAmount" },
          totalOfferDiscount: { $sum: "$offerDiscount" },
          totalCouponDiscount:{$sum:"$couponDiscount"}
        }
      },
      { $sort: { _id: 1 } }
    ])
  
     // Create a new Excel workbook
     const workbook = new ExcelJS.Workbook();
     const worksheet = workbook.addWorksheet('Sheet 1');
 
     // Add headers
     const headers = Object.keys( yearlyData[0]);
     worksheet.addRow(headers);
 
     // Add data rows
     yearlyData.forEach(item => {
         const values = Object.values(item);
         worksheet.addRow(values);
     });
 
     // Set response headers
     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
     res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');

     workbook.xlsx.write(res)
     .then(() => {
         res.end();
     })
     .catch(err => {
         console.error('Error generating Excel:', err);
         res.status(500).send('Error generating Excel');
     });
 
  }catch(error){
    console.log(error);
  }
}

const generateExcelExportDaily =async(req,res)=>{
  try{
    const dailyData = await orderModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: 1 },
          totalSalesAmount: { $sum: "$orderAmount" },
          totalOfferDiscount: { $sum: "$offerDiscount" },
          totalCouponDiscount: { $sum: "$couponDiscount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])
  
     // Create a new Excel workbook
     const workbook = new ExcelJS.Workbook();
     const worksheet = workbook.addWorksheet('Sheet 1');
 
     // Add headers
     const headers = Object.keys( dailyData[0]);
     worksheet.addRow(headers);
 
     // Add data rows
     dailyData.forEach(item => {
         const values = Object.values(item);
         worksheet.addRow(values);
     });
 
     // Set response headers
     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
     res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');

     workbook.xlsx.write(res)
     .then(() => {
         res.end();
     })
     .catch(err => {
         console.error('Error generating Excel:', err);
         res.status(500).send('Error generating Excel');
     });
 
  }catch(error){
    console.log(error);
  }
}


const saleGraphData =async (req,res)=>{
  try{
    console.log(req.body)
    let salesData =
    {
        "labels": [],
        "salesData": [],
        "revenueData": [],
        "productsData": []
    }
    const { filter, time } = req.body ;
    if(filter === "monthly"){
      salesData.labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const contraints = {
          $gte: new Date(`${time}-01-01T00:00:00.000Z`),
          $lte: new Date(`${time}-12-31T00:00:00.000Z`)            
      }
      const sales = await orderModel.aggregate([
          {
              $match: {
                  createdAt: contraints
              }
          },
          {
              $group: {
                  _id: {
                      $month: "$createdAt"
                  },
                  revenueData: {
                      $sum: "$orderAmount"
                  },
                  salesData: {
                      $sum: 1
                  }
              }
          },
          {
              $sort: {
                  "_id": 1
              }
          }
      ])
      const products = await productModel.aggregate([
        {
            $match: {
                createdAt: contraints
            }
        },
        {
            $group: {
                _id: {
                    $month: "$createdAt"
                },
                productsData: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                "_id": 1 // Sort by month in ascending order
            }
        }
    ])
    salesData.salesData = sales.map((item) => item.salesData);
    salesData.revenueData = sales.map((item) => item.revenueData/1000);
    salesData.productsData = products.map((item) => item.productsData);
    console.log(salesData)
    }else{
      console.log('else')
      salesData.labels = [`${time-10}`, `${time-9}`, `${time-8}`, `${time-7}`, `${time-6}`, `${time-5}`, `${time-4}`, `${time-3}`, `${time-2}`, `${time-1}`, `${time}`];
      const contraints = {
          $gte: new Date(`${time-10}-01-01T00:00:00.000Z`),
          $lte: new Date(`${time}-12-31T00:00:00.000Z`)            
      }
      const sales= await orderModel.aggregate([
          {
              $match: {
                  createdAt: contraints
              }
          },
          {
              $group: {
                  _id: {
                      $year: "$createdAt"
                  },
                  revenueData: {
                      $sum: "$orderAmount"
                  },
                  salesData: {
                      $sum: 1
                  }
              }
          },
          {
              $sort: {
                  "_id": 1
              }
          }
      ])
      const products = await productModel.aggregate([
          {
              $match: {
                  createdAt: contraints
              }
          },
          {
              $group: {
                  _id: {
                      $year: "$createdAt"
                  },
                  productsData: {
                      $sum: 1
                  }
              }
          },
          {
              $sort: {
                  "_id": 1 
              }
          }
      ])
      for(let key of sales){
        console.log("this is ind", key)
        for(let data of salesData.labels){
            console.log("iteratong", data)                
            if (key._id == data) {                        
                salesData.salesData.push(key.salesData) 
                salesData.revenueData.push(key.revenueData/1000)
            }else{
                salesData.salesData.push(0)
                salesData.revenueData.push(0)
            }                    
        }            
    }
    for(let key of products){
        console.log("this is ind", key)
        for(let data of salesData.labels){
            console.log("iteratong", data)                
            if (key._id == data) {                        
                salesData.productsData.push(key.productsData) 
            }else{
                salesData.productsData.push(0)
            }                    
        }            
    }
   
    }   
    res
    .status(200)
    .json(salesData)
  }catch(error){
    console.log(error)
  }
}


// ledgerbookloader

const ledgerbookloader =async(req,res)=>{
  try{
    const ledgerData= await ledgerBookModel.find({});
    res.render('ledger',{ledgerData});
  }catch(error){
    console.log(error.message);
  }
}






module.exports = {
  adminLoginLoader,
  verifyAdminLogin,
  adminHomeLoader,
  addProductsLoader,
  productsLoader,
  categoriesLoader,
  transactionsLoader,
  reviewsLoader,
  ordersLoader,
  addProductDb,
  loadAddCategory,
  addCategoryDb,
  editProduct,
  editProductDb,
  editcategoryDb,
  userLoader,
  blockUser,
  unblockUser,
  orderDetailsLoader,
  orderStatusUpdate,
  logoutAdminhandler,
  logOutAdmin,
  cancelApprovedHandler,
  cancelDiscardHandler,
  returnApprovedHandler,
  returnDiscardHandler,
  loadReviews,
  couponsLoader,
  addCoupon,
  addCouponDb,
  editCouponLoader,
  editCouponDb,
  addofferload,
  offerDb ,
  alloffersloader,
  removeOfferHandler,
  reactivateOfferHandler,
  salesReportLoader,
  excelGenerator,
  pdfGenerator,
  customsalesreport,
  generateExcelExportWeekly,
  generateExcelExportYearly,
  generateExcelExportMonthly,
  generateExcelExportDaily,
  saleGraphData,
  ledgerbookloader
};
