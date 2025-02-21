const express = require("express");
const router = express.Router();

router.route("/")
    .get((req, res)=>{
        res.send("home page");
    });

router.route("/search")
    .get((req, res)=>{
        // use query string
        res.send('search results');
    })

module.exports = router;