const express = require("express");
const adminRoute = express();
const path = require("path");
const adminController = require("../controllers/adminController");
const upload = require("../middleware/multer");
const uploadB = require("../middleware/multerblob")
const { isAdminLogin, isAdminLogout } = require("../middleware/auth");
adminRoute.set("views", "./views/admin");
adminRoute.use(
  "/admin/editproduct/assets",
  express.static(path.join(__dirname, "../assets"))
);
adminRoute.get("/login",isAdminLogout, adminController.adminLoginLoader);
adminRoute.post("/login", adminController.verifyAdminLogin);
adminRoute.get("/home",isAdminLogin,adminController.adminHomeLoader);

adminRoute.get("/addproduct", isAdminLogin, adminController.addProductsLoader);
adminRoute.get("/products", isAdminLogin, adminController.productsLoader);

adminRoute.post(
  "/addproduct",
  upload.array("files", 4),
  adminController.addProductDb
);

adminRoute.get("/category", isAdminLogin, adminController.loadAddCategory);
adminRoute.post("/addcategory", isAdminLogin, adminController.addCategoryDb);
adminRoute.get("/editproduct/:id", isAdminLogin, adminController.editProduct);
adminRoute.post(
  "/editproduct/:id",
  isAdminLogin,
  upload.array("images", 4),
  adminController.editProductDb
);
adminRoute.post(
  "/editcategory/:id",
  isAdminLogin,
  adminController.editcategoryDb
);

adminRoute.get("/orders", isAdminLogin, adminController.ordersLoader);

adminRoute.get(
  "/orderdetails/:id",
  isAdminLogin,
  adminController.orderDetailsLoader
);
// logout
adminRoute.get("/logout", adminController.logOutAdmin);

adminRoute.post("/changestatus", adminController.orderStatusUpdate);

adminRoute.get("/users", adminController.userLoader);

adminRoute.post("/blockuser/:id", adminController.blockUser);
adminRoute.post("/unblockuser/:id", adminController.unblockUser);

adminRoute.post("/cancelapproved", adminController.cancelApprovedHandler);
adminRoute.post("/canceldiscard", adminController.cancelDiscardHandler);
adminRoute.post("/returnapproved", adminController.returnApprovedHandler);
adminRoute.post("/returndiscard", adminController.returnDiscardHandler);
adminRoute.get("/reviews", adminController.loadReviews);

adminRoute.get("/coupons",isAdminLogin,adminController.couponsLoader);
adminRoute.get("/addCoupon",isAdminLogin,adminController.addCoupon);
adminRoute.post("/addcoupon",adminController.addCouponDb)

adminRoute.get("/editcoupon/:id",adminController.editCouponLoader);
adminRoute.post("/editcoupon/:id",adminController.editCouponDb);
adminRoute.get("/addoffer",isAdminLogin,adminController.addofferload)
adminRoute.post("/addoffer", uploadB.single("image"),adminController.offerDb);
adminRoute.get("/offers",isAdminLogin,adminController.alloffersloader);

adminRoute.post("/removeoffer/:id",adminController.removeOfferHandler)
adminRoute.post("/addoffer/:id",adminController.reactivateOfferHandler)

// sales report
adminRoute.get("/salesreport",isAdminLogin,adminController.salesReportLoader);
adminRoute.post('/generate-pdf',adminController.pdfGenerator)
adminRoute.post('/generate-excel',adminController.excelGenerator)
adminRoute.post('/customsalesreport',adminController.customsalesreport);
module.exports = adminRoute;
