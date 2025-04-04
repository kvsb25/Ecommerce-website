const express = require("express");
const { verifyUser, verifyRole } = require("../middleware");
const customerController = require("../controller/customer.js");
const asyncWrap = require("../utils/wrapAsync.js");
const router = express.Router();
const Orders = require("../models/order.js");
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
    // get customer's cart details
    .get(verifyUser,  verifyRole('customer'), asyncWrap(customerController.getCustomerCart))
    // add a product to customer's cart (product id, it's quantity is passed as query parameter)
    .post(verifyUser,  verifyRole('customer'), asyncWrap(customerController.addProductToCart))
    // update a product's details in customer's cart (product id, it's quantity is passed as query parameter)
    .put(verifyUser,  verifyRole('customer'), asyncWrap(customerController.updateCustomerCart))
    // empty customer's cart
    .delete(verifyUser,  verifyRole('customer'), asyncWrap(customerController.emptyCustomerCart));

router.route('/order')
    .get( verifyRole('customer'), async (req, res) => {
        //return all the orders belonging to the customer
        const orders = await Orders.find({customer: req.user._id}).populate({path: 'products.product'});
        console.log(orders);
        if(!orders) return res.status(404).send("No orders found for this customer");
        return res.status(200).send("customer's orders");
    })

module.exports = router;