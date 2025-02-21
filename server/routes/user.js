const express = require("express");
const router = express.Router();
const customerRouter = require("./customer.js");
const vendorRouter = require("./vendor.js");

router.route("/signup")
    .get((req, res)=>{
        res.send('signup form')
    })
    .post((req, res)=>{
        // register user to database
        // create a jwt token of the user and send it in a httpOnly cookie
        res.send('httpStatus');
    })

router.route('/login')
    .get((req, res)=>{
        // if jwt in cookie is verified then redirect to the page previous page
        res.send('login form')
    })
    .post((req, res)=>{
        // login user by
        res.send('httpStatus');
    })

module.exports = router;