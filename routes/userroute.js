const express = require("express");
const userRoute = express();
const userController = require("../controllers/userController");
const otpController = require("../controllers/otpController");
const otpGenerator = require("../middleware/otpgenerator");
const { isLogin, isLogout, isBlocked } = require("../middleware/auth");
const cartController = require("../controllers/cartcontroller");

userRoute.get("/", userController.loadHomepage);
userRoute.get("/login", userController.loadloginpage);
userRoute.get("/register", userController.loadRegisterpage);
userRoute.post("/register", userController.signupDb, otpController.sendOtpMail);
userRoute.post("/login", userController.verifylogin);
userRoute.get("/productdetail/:id", userController.productDetailsLoad);
userRoute.get("/shop", userController.shopLoader);
userRoute.post("/addaddress", userController.addAddressDb);
userRoute.get("/logout", userController.logoutFn);

userRoute.get("/cart", isLogin, isBlocked, cartController.cartLoader);
userRoute.get("/addtocart/:id", cartController.addToCart);
userRoute.post(
  "/cart/quantitychange/:id",
  isLogin,
  isBlocked,
  cartController.quantityUpdate
);
userRoute.post(
  "/cart/removecart/:id",
  isLogin,
  isBlocked,
  cartController.removeFromCart
);
userRoute.get(
  "/cart/checkout",
  isLogin,
  isBlocked,
  cartController.checkOutLoader
);
userRoute.post(
  "/cart/placeorder/",
  isLogin,
  isBlocked,
  cartController.placeorderdb
);
userRoute.get(
  "/cart/orderconfirm/",
  isLogin,
  cartController.orderconfirmloader
);

userRoute.post("/changepassword", isLogin, userController.changePasswordDb);
userRoute.post("/editprofile", isLogin, userController.editProfileHandler);
userRoute.post("/editAddress/:id", isLogin, userController.editAddresshandler);

userRoute.post("/resendotp", otpController.resendotphandler);

userRoute.get("/forgetpassword", userController.forgetpasswordloader);
userRoute.post("/forgetpassword", userController.forgetpasswordhandler);
userRoute.get("/updatepassword", userController.updatepasswordloader);
userRoute.post("/updatepassword", userController.updatepassworddb);

// cancel order
userRoute.post("/cancelorder", userController.cancelOrder);
userRoute.post("/returnorder", userController.returnOrder);

// wishlist
userRoute.post("/addtowishlist", userController.addtowishlisthandler);
userRoute.get("/wishlist", isLogin, isBlocked, userController.wishlistloader);
userRoute.post("/removewishlist", isLogin, userController.removefromWishlist);
// category rendering
userRoute.get("/rendercategory/:id", userController.categoryRenderer);
// sort by
userRoute.get("/products/sort/A-Z", userController.sortAscendingName);
userRoute.get("/products/sort/Z-A", userController.sortDescendingName);
userRoute.get("/products/sort/toprated",userController.topRatedProducts);

// addtocart from product details
userRoute.post(
  "/productdetails/addtocart/:id",
  
  cartController.addtocartProductDetailsHandler
);

// add to wishlist from product details




userRoute.get('/notification',isLogin,isBlocked,userController.notificationLoader)




userRoute.post('/verifypayment',userController.verifyPaymentHandler);

userRoute.post('/paypendingorder',userController.pendingPaymentHandler);

userRoute.post('/cart/verifycoupon',userController.couponVerifier);

// wallets

userRoute.post('/addtowallet',userController.addToWalletHandler);
userRoute.post('/verifywalletpayment',userController.verifyWalletPaymentHandler)

//search products

userRoute.get('/search',userController.searchProducts)

// invoice
userRoute.get('/invoice',userController.invoiceloader)
userRoute.post('/generate-pdf',userController.invoicepdfdownload)
module.exports = userRoute;
