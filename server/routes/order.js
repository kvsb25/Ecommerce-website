const express = require("express");
const router = express.Router();
const {verifyUser} = require("../middleware.js");

// remove a product when it's stock get's equal to zero

router.route('/')
    .get((req, res)=>{
        // fetch user._id using  
        res.send("list of orders of req.user._id");
    })
    .post((req, res)=>{
        // redirect payments gateway
        // update order.status; add order collection in DB
        // add only if(payement) and order.status == "successful"
        res.send("httpStatus");
    })

router.route("/checkout")
    .get(verifyUser, (req, res)=>{
        res.send("checkout page");
    });

router.route("/:orderId")
    .get((req, res)=>{
        res.send("order details with orderId");
    })
    .delete((req, res)=>{
        // cancel an order
        // delete an order by id from DB 
        res.send("httpStatus");
    })

module.exports = router;