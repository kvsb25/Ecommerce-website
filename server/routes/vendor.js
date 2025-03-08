const express = require("express");
const router = express.Router();
// const redisClient = require("redis").createClient();
// const {DEFAULT_EXPIRATION} = require("../constants/redis.js");
const {getOrSetCache} = require("../utils/redisCache.js");
const { verifyUser, verifyRole } = require("../middleware");
const Vendor = require("../models/vendor");

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
    .get(verifyUser, verifyRole('vendor'), async (req, res) => {
        // verify if req.user = {username, role}
        // console.log(req.user);
        const vendorDetails = await getOrSetCache(`vendor:${req.user.username}`, async ()=>{
            console.log("in callback")
            const vendorDetails = await Vendor.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: "$user" },
                { $match: { "user.username": req.user.username } }, // try to match this with user._id 
                { $limit: 1 }
            ]);
            
            // console.log(vendorDetails);
            return vendorDetails;
        })

        // const vendorDetails = await Vendor.aggregate([
        //     {
        //         $lookup: {
        //             from: "users",
        //             localField: "userId",
        //             foreignField: "_id",
        //             as: "user"
        //         }
        //     },
        //     { $unwind: "$user" },
        //     { $match: { "user.username": req.user.username } }, // try to match this with user._id 
        //     { $limit: 1 }
        // ]);
        console.log(vendorDetails[0].user);  //for aggregate pipeline try vendorDetails[0].user._id.toString()
        res.send("vendor's profile page");
    })
    .put(async (req, res)=>{
    
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