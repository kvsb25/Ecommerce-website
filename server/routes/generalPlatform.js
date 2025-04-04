const express = require("express");
const { verifyUser, verifyRole } = require("../middleware");
const router = express.Router();

router.route("/")
    .get((req, res)=>{
        // res.status(200).send("home page");
        return res.render("customer/cart.ejs");
        // return res.render("vendor/orders.ejs");
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

/*
const orders = document.querySelector(".customer-orders");
        const account = document.querySelector(".customer-account");
        const orders_btn = document.getElementById("orders-btn");
        const account_btn = document.getElementById("account-btn");

        orders_btn.addEventListener("click", ()=>{
            account.style.display = "none";
            account_btn.classList.remove("option-active");
            orders.style.display = "grid";
            orders_btn.classList.add("option-active");
        });
        account_btn.addEventListener("click", ()=>{
            orders.style.display = "none";
            orders_btn.classList.remove("option-active");
            account.style.display = "grid";
            account_btn.classList.add("option-active");
        });
*/