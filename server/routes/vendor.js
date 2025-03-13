const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");
const vendorController = require("../controller/vendor.js");
// const {setCache} = require("../utils/redisCache.js");
// const {fetchVendorDetailsFromDB} = require("../utils/vendor.js");
const { verifyUser } = require("../middleware");
const Products = require("../models/product.js");
// const Vendor = require("../models/vendor");
// const User = require("../models/user.js");

router.route("/dashboard")
    .get((req, res) => {
        // page will have vendor details, vendor product details, orders to be delivered
        res.send("dashboard page");
    })

router.route("/dashboard/sales")
    .get((req, res) => {
        res.send("sales page");
    })

router.route("/profile")
    .get(verifyUser, async (req, res) => {
        res.json(req.user);
    })
    .put(verifyUser, vendorController.updateProfile)

router.route("/products")
    .get(verifyUser, async (req, res) => {
        console.log(req.body);
        const products = await Products.find({vendor: req.user._id});
        console.log(products); // array of products

        res.send(products); //products belonging to vendor
    })
    .post(verifyUser, async (req, res) => {
        // add product belonging to vendor
        console.log(req.body);
        const newProduct = new Products({...req.body, vendor : req.user._id});
        await newProduct.save();
        console.log(newProduct);
        res.send("httpStatus");
    })

router.route("/products/new")
    .get((req, res) => {
        res.send("new product form page");
    })

router.route("/products/:productId")
    .get(verifyUser, async (req, res) => {
        const {productId} = req.params;
        const productDetails = await Products.findById(productId);
        console.log(productDetails);
        res.send(productDetails);
    })
    .put(verifyUser, async (req, res) => {
        const {field, fieldUpdate} = req.query;
        const {productId} = req.params;
        console.log(`field: ${field}; fieldUpdate: ${fieldUpdate}; productId: ${productId}`);
        await Products.findByIdAndUpdate(productId, {$set: {[field]: fieldUpdate}});
        // update product details
        // use query string to specify what detail of a product to update
        res.send("httpStatus");
    })
    .delete(async (req, res) => {
        // delete product by productId
        const {productId} = req.params;
        await Products.findByIdAndDelete(productId);
        res.send("httpStatus");
    })

module.exports = router;