const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const redisClient = require("redis").createClient();
// const {DEFAULT_EXPIRATION} = require("../constants/redis.js");
const {setCache} = require("../utils/redisCache.js");
const {fetchVendorDetailsFromDB} = require("../utils/vendor.js");
const { verifyUser } = require("../middleware");
const Vendor = require("../models/vendor");
const User = require("../models/user.js");

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
    .put(verifyUser, async (req, res)=>{
        let {model, field, fieldUpdateValue} = req.query; // model specifies user or vendor, field specifies the field to be updated, fieldUpdateValue specifies the update to be made

        // console.log(`model: ${model}, field: ${field}, fieldUpdateValue: ${fieldUpdateValue}`);

        // update field with fieldUpdateValue
        if(model == 'user'){
            await User.findByIdAndUpdate(req.user.userId, {$set: {[field]: fieldUpdateValue}}); // using computed property name to dynamically determine which field is to be updated
        } else if(model == 'vendor') {
            await Vendor.findByIdAndUpdate(req.user._id, {$set: {[field]: fieldUpdateValue}});
        } else {
            return res.sendStatus(400);
        }

        // // keeping cached data up to date
        const updatedUser = await fetchVendorDetailsFromDB(req.user.user);
        await setCache(`vendor:${req.user.userId}`, updatedUser);
        return res.sendStatus(200);
    })

router.route("/products")
    .get((req, res) => {
        res.send("products belonging to vendor");
    })
    .post((req, res) => {
        // add product belonging to vendor
        res.send("httpStatus");
    })

router.route("/products/new")
    .get((req, res) => {
        res.send("new product form page");
    })

router.route("/products/:productId")
    .get((req, res) => {
        res.send("vendor specific product details page");
    })
    .put((req, res) => {
        // update product details
        // use query string to specify what detail of a product to update
        res.send("httpStatus");
    })
    .delete((req, res) => {
        // delete product by productId
        res.send("httpStatus");
    })

module.exports = router;