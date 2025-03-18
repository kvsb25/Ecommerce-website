const express = require("express");
const router = express.Router();
const vendorController = require("../controller/vendor.js");
const { verifyUser, verifyVendor, verifyRole } = require("../middleware");
const asyncWrap = require("../utils/wrapAsync.js");

router.route("/dashboard/view")
    .get(verifyRole('vendor'), (req, res) => {
        // page will have vendor details, vendor product details, orders to be delivered
        res.send("dashboard page");
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
        res.send("profile page");
    })
router.route("/profile")
    .get(verifyUser, verifyRole('vendor'), async (req, res) => {
        res.json(req.user);
        // profile page
    })
    .put(verifyUser, verifyRole('vendor'), asyncWrap(vendorController.updateProfile))

router.route("/products")
    .get(verifyUser, verifyRole('vendor'), verifyVendor, asyncWrap(vendorController.getProductsOfVendor))
    .post(verifyUser, verifyRole('vendor'), verifyVendor, asyncWrap(vendorController.addNewProduct))

router.route("/products/new")
    .get(verifyUser, verifyRole('vendor'), verifyVendor, vendorController.newProductFormPage);

router.route("/products/:productId")
    .get(verifyUser, verifyRole('vendor'), verifyVendor, asyncWrap(vendorController.getProductDetails))
    .put(verifyUser, verifyRole('vendor'), verifyVendor, asyncWrap(vendorController.updateProductDetails))
    .delete(verifyUser, verifyRole('vendor'), verifyVendor, asyncWrap(vendorController.deleteProduct))

module.exports = router;