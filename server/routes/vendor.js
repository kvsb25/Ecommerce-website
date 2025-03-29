const express = require("express");
const router = express.Router();
const vendorController = require("../controller/vendor.js");
const { verifyUser, verifyVendor, verifyRole } = require("../middleware");
const asyncWrap = require("../utils/wrapAsync.js");

router.route("/dashboard/view")
    .get(verifyRole('vendor'), (req, res) => {
        // page will have vendor details, vendor product details, orders to be delivered
        res.render("vendorDashboard");
    })

router.route("/dashboard")
    .get(verifyUser, verifyRole('vendor'), verifyVendor, (req, res) => {
        // page will have vendor details, vendor product details, orders to be delivered
        res.send("dashboard details");
    })

router.route("/dashboard/sales")
    .get(verifyRole('vendor'), (req, res) => {
        res.send("sales page");
    })

router.route("/profile/view")
    .get(verifyRole('vendor'), (req, res) => {
        res.render("vendorProfile.ejs");
    })
router.route("/profile")
    // get vendor profile details
    .get(verifyUser, verifyRole('vendor'), async (req, res) => {
        res.json(req.user);
    })
    // update profile details (field, fieldUpdate are passed as query parameter)
    .put(verifyUser, verifyRole('vendor'), asyncWrap(vendorController.updateProfile))

router.route("/products")
    .get(verifyUser, verifyRole('vendor'), verifyVendor, asyncWrap(vendorController.getProductsOfVendor))
    .post(verifyUser, verifyRole('vendor'), verifyVendor, asyncWrap(vendorController.addNewProduct))

router.route("/products/new")
    .get(verifyUser, verifyRole('vendor'), verifyVendor, vendorController.newProductFormPage);

// use in vendor dashboard
router.route("/products/:productId")
    .get(verifyUser, verifyRole('vendor'), verifyVendor, asyncWrap(vendorController.getProductDetails))
    .put(verifyUser, verifyRole('vendor'), verifyVendor, asyncWrap(vendorController.updateProductDetails))
    .delete(verifyUser, verifyRole('vendor'), verifyVendor, asyncWrap(vendorController.deleteProduct))

router.route("/orders/view")
    .get(verifyUser, verifyRole('vendor'), verifyVendor, (req, res) =>{
        res.render("vendor/orders.ejs");
    })

router.route("/orders")
    .get(verifyUser, verifyRole('vendor'), verifyVendor, asyncWrap(vendorController.getOrdersOfVendor))
module.exports = router;