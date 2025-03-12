const express = require("express");
const { verifyUser } = require("../middleware");
const {fetchCustomerDetailsFromDB} = require("../utils/customer.js");
const {setCache} = require("../utils/redisCache.js");
const Customer = require("../models/customer.js");
const User = require("../models/user.js");
const router = express.Router();

router.route('/profile')
    // using same logic as .get('vendor/profile') so do club, modularize the functions later
    .get(verifyUser, (req, res) => {
        console.log(req.user);
        res.status(200).send(req.user);
    })
    // using same logic as .put('vendor/profile') so do club, modularize the functions later
    .put(verifyUser, async (req, res) => {
        let { model, field, fieldUpdateValue } = req.query; // model specifies user or vendor, field specifies the field to be updated, fieldUpdateValue specifies the update to be made

        // update field with fieldUpdateValue
        if (model == 'user') {
            await User.findByIdAndUpdate(req.user.userId, { $set: { [field]: fieldUpdateValue } }); // using computed property name to dynamically determine which field is to be updated
        } else if (model == 'customer') {
            await Customer.findByIdAndUpdate(req.user._id, { $set: { [field]: fieldUpdateValue } });
        } else {
            return res.sendStatus(400);
        }

        // keeping cached data up to date
        const updatedUser = await fetchCustomerDetailsFromDB(req.user.user);
        await setCache(`customer:${req.user.userId}`, updatedUser);
        return res.sendStatus(200);
    })

router.route('/profile/credentials')
    .get((req, res) => {
        res.status(200).send("customer profile credentials page");
    })

router.route("/cart/view")
    .get((req, res) => {
        res.status(200).send("customer cart page");
    })

router.route('/cart')
    .get((req, res) => {
        res.status(200).send("customer cart details");
    })
    .post((req, res) => {
        // add product to customer's cart
        res.status(200).send('httpStatus');
    })
    .put((req, res) => {
        // update cart: qty of products in cart, or remove a product from cart
        // use query string to specify which detail of a cart/cart's product to update
        res.status(200).send("httpStatus");
    })
    .delete((req, res) => {
        // empty the cart
        // remove all the products in the cart
        res.status(200).send("httpStatus"); // make sure a mongoose middleware is declared for removing a product from cart if it's qty becomes 0
    })

router.route('/order')
    .get((req, res) => {
        res.status(200).send("customer's orders page");
    })


module.exports = router;