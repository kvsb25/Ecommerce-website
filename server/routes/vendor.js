const express = require("express");
const router = express.Router();

router.route("/dashboard")
    .get((req, res)=>{
        // page will have vendor details, vendor product details, orders to be delivered
        res.send("dashboard page");
    })

router.route("/dashboard/sales")
    .get((req, res)=>{
        res.send("sales page");
    })

router.route("/products")
    .get((req, res)=>{
        res.send("products belonging to vendor");
    })
    .post((req, res)=>{
        // add product belonging to vendor
        res.send("httpStatus");
    })

router.route("/products/new")
    .get((req, res)=>{
        res.send("new product form page");
    })

router.route("/products/:productId")
    .get((req, res)=>{
        res.send("vendor specific product details page");
    })
    .put((req, res)=>{
        // update product details
        // use query string to specify what detail of a product to update
        res.send("httpStatus");
    })
    .delete((req, res)=>{
        // delete product by productId
        res.send("httpStatus");
    })

module.exports = router;