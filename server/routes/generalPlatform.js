const express = require("express");
const { verifyUser, verifyRole } = require("../middleware");
const router = express.Router();

router.route("/")
    .get((req, res)=>{
        // res.status(200).send("home page");
        return res.render("store.ejs");
    });

router.route("/store")
    .get(verifyUser, verifyRole('customer'), (req, res)=>{
        return res.render("store.ejs");
    })

router.route("/search")
    .get((req, res)=>{
        // use query string
        res.status(200).send('search results');
    })

module.exports = router;