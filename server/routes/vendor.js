const express = require("express");
const router = express.Router();
const vendorController = require("../controller/vendor.js");
const { verifyUser } = require("../middleware");
const asyncWrap = require("../utils/wrapAsync.js");

router.route("/dashboard/view")
    .get((req, res) => {
        // page will have vendor details, vendor product details, orders to be delivered
        res.send("dashboard page");
    })

router.route("/dashboard")
    .get((req, res) => {
        // page will have vendor details, vendor product details, orders to be delivered
        res.send("dashboard details");
    })

router.route("/dashboard/sales")
    .get((req, res) => {
        res.send("sales page");
    })

router.route("/profile/view")
    .get((req, res)=>{
        res.send("profile page");
    })
router.route("/profile")
    .get(verifyUser, async (req, res) => {
        res.json(req.user);
        // profile page
    })
    .put(verifyUser, asyncWrap(vendorController.updateProfile))

router.route("/products")
    .get(verifyUser, asyncWrap(vendorController.getProductsOfVendor))
    .post(verifyUser, asyncWrap(vendorController.addNewProduct))

router.route("/products/new")
    .get(verifyUser, vendorController.newProductFormPage);

router.route("/products/:productId")
    .get(verifyUser, asyncWrap(vendorController.getProductDetails))
    .put(verifyUser, asyncWrap(vendorController.updateProductDetails))
    .delete(verifyUser, asyncWrap(vendorController.deleteProduct))

module.exports = router;