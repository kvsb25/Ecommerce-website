const express = require("express");
const router = express.Router();

router.route('/profile')
    .get((req, res)=>{
        res.send('customer profile page');
    })

router.route('/profile/credentials')
    .get((req, res)=>{
        res.send("customer profile credentials page");
    })

router.route("/cart/view")
    .get((req, res)=>{
        res.send("customer cart page");
    })

router.route('/cart')
    .get((req, res)=>{
        res.send("customer cart details");
    })
    .post((req, res)=>{
        // add product to customer's cart
        res.send('httpStatus');
    })
    .put((req, res)=>{
        // update cart: qty of products in cart, or remove a product from cart
        // use query string to specify which detail of a cart/cart's product to update
        res.send("httpStatus");
    })
    .delete((req, res)=>{
        // empty the cart
        // remove all the products in the cart
        res.send("httpStatus"); // make sure a mongoose middleware is declared for removing a product from cart if it's qty becomes 0
    })

// router.route('/cart/:productId')
//     .delete((req, res)=>{
//         res.send('delete product with productId from customers cart');
//     });

router.route('/order')
    .get((req, res)=>{
        res.send("customer's orders page");
    })


module.exports = router;