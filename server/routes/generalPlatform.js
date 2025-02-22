const express = require("express");
const router = express.Router();

router.route("/")
    .get((req, res)=>{
        res.status(200).send("home page");
    });

router.route("/search")
    .get((req, res)=>{
        // use query string
        res.status(200).send('search results');
    })

module.exports = router;