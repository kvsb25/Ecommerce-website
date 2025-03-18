const express = require("express");
const { verifyUser, verifyRole } = require("../middleware");
const customerController = require("../controller/customer.js");
const asyncWrap = require("../utils/wrapAsync.js");
const router = express.Router();
// const {fetchCustomerDetailsFromDB} = require("../utils/customer.js");
// const {setCache} = require("../utils/redisCache.js");
// const Customer = require("../models/customer.js");
// const Cart = require("../models/cart.js");
// const User = require("../models/user.js");

router.route('/profile')
    // using same logic as .get('vendor/profile') so do club, modularize the functions later
    .get(verifyUser,  verifyRole('customer'), (req, res) => {
        console.log(req.user);
        return res.status(200).send(req.user);
    })
    // using same logic as .put('vendor/profile') so do club, modularize the functions later
    .put(verifyUser,  verifyRole('customer'), asyncWrap(customerController.updateProfile))

router.route('/profile/credentials')
    .get( verifyRole('customer'), (req, res) => {
        return res.status(200).send("customer profile credentials page");
    })

router.route('/profile/view')
    .get( verifyRole('customer'), (req, res) => {
        return res.send("page for profile");
    })

router.route("/cart/view")
    .get( verifyRole('customer'), (req, res) => {
        return res.status(200).send("customer cart page");
    })

router.route('/cart')
    .get(verifyUser,  verifyRole('customer'), asyncWrap(customerController.getCustomerCart))
    .post(verifyUser,  verifyRole('customer'), asyncWrap(customerController.addProductToCart))
    .put(verifyUser,  verifyRole('customer'), asyncWrap(customerController.updateCustomerCart))
    .delete(verifyUser,  verifyRole('customer'), asyncWrap(customerController.emptyCustomerCart));

router.route('/order/view')
    .get( verifyRole('customer'), (req, res) => {
        //show all the order's placed by the customer
        return res.status(200).send("customer's orders page");
    })

module.exports = router;