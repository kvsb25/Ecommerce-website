const express = require("express");
const router = express.Router();
const customerRouter = require("./customer.js");
const vendorRouter = require("./vendor.js");
const userController = require("../controller/user.js");
const asyncWrap = require("../utils/wrapAsync.js");
// const jwt = require("jsonwebtoken");

router.route("/signup")
    .get((req, res) => {
        res.send('signup form');
    })
    .post(asyncWrap(userController.signUpUser));

router.route('/login')
    .get((req, res) => {
        res.send('login form');
    })
    .post(asyncWrap(userController.loginUser));

router.route('/generateToken')
    .get(userController.generateToken);

module.exports = router;