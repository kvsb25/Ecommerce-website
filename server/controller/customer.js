const { fetchCustomerDetailsFromDB } = require("../utils/customer.js");
const { setCache, fetchDetails } = require("../utils/redisCache.js");
const ExpressError = require("../utils/ExpressError.js");
const Customer = require("../models/customer.js");
const Cart = require("../models/cart.js");
const User = require("../models/user.js");

module.exports.updateProfile = async (req, res, next) => {
    let { model, field, fieldUpdateValue } = req.query; // model specifies user or vendor, field specifies the field to be updated, fieldUpdateValue specifies the update to be made

    if (!model || !field || fieldUpdateValue === undefined) {
        return res.status(400).send("Missing required parameters");
    }

    // update field with fieldUpdateValue
    const updateResult = await (model === "user"
        ? User.findByIdAndUpdate(req.user.userId, { $set: { [field]: fieldUpdateValue } }, { new: true })
        : Customer.findByIdAndUpdate(req.user._id, { $set: { [field]: fieldUpdateValue } }, { new: true })
    );

    if (!updateResult) {
        return res.status(404).send("User, customer not found");
    }

    try {
        const updatedUser = await fetchCustomerDetailsFromDB(req.user.user);
        await setCache(`customer:${req.user.userId}`, updatedUser);
    } catch (cacheError) {
        return res.status(500).send("Internal Server error");
    }
    return res.sendStatus(200);
}

module.exports.getCustomerCart = async (req, res) => {   // cart/view will send get request to this route to get the customer's cart details
    // const user = req.user;
    
    const cart = await fetchDetails(
        `cart:${req.user.cart}`,
        req.user, 
        async (user) => { 
            const cart = await Cart.findById(user.cart).populate({ path: 'products.product' });
            return cart;
        }
    );

    if (!cart) return res.status(404).send("Cart not found");
    if (!cart.products || cart.products.length == 0) return res.status(204).send("No products in cart");
    return res.status(200).json(cart);
}

module.exports.addProductToCart = async (req, res) => {
    // add product to customer's cart
    // send productId as query string

    const productId = req.query.productId;
    const quantity = Number(req.query.quantity) || 1;
    // const quantity = Math.abs(Number(req.query.quantity)) || 1;
    if (!productId || !quantity) return res.status(400).send("Missing required parameters");

    const cart = await Cart.findById(req.user.cart);
    if (!cart) return res.status(404).send("Cart not found");
    console.log(`cart : ${cart}`);
    const existingProduct = cart.products?.find(p => p.product.toString() === productId); // returns that object in products array whose product (ObjectId('...')) is equal to productId

    if (existingProduct) {
        existingProduct.qty += quantity;  // if the product already exists in the cart, then only increase or decrease it's quantity
    } else {
        if(!cart.products) cart.products = []; // if products array is undefined, initialize it to an empty array
        if(quantity < 0) return res.status(400).send("Quantity cannot be negative");
        cart.products.push({ product: productId, qty: quantity }); // add a new product to cart
    }
    cart.products = cart.products.filter(product => product.qty > 0); // remove products with qty <= 0
    await cart.save();
    return res.status(200).send({update: {productId, quantity}, message: "Product added to cart"});
}

module.exports.updateCustomerCart = async (req, res) => {
    // update cart: qty of products in cart, or remove a product from cart
    // use query string to specify which detail of a cart/cart's product to update
    const productId = req.query.productId;
    const quantity = Number(req.query.quantity) || 1;
    const cart = await Cart.findById(req.user.cart);

    if (!cart) return res.status(404).send("Cart not found");
    if (!productId || !quantity) return res.status(400).send("Missing required parameters");

    const product = cart.products.find(p => p.product.toString() === productId);

    if (!product) return res.status(404).send("Product not found");

    product.qty += quantity;

    await cart.save();

    let update = await Cart.findByIdAndUpdate(req.user.cart, { $pull: { products: { qty: 0 } } }, { new: true });  //remove all the products with qty == 0
    if (!update) return res.status(500).send("Internal Database Error");

    return res.status(200).send("cart updated");
}

module.exports.deleteProdFromCart = async (req, res) => {
    // const productId = req.query.productId;
    // const all = req.query.all;
    const {productId, all} = req.query;

    if(!productId && !all) return res.status(400).send("Missing required parameters");

    if(all){
        let update = await Cart.findByIdAndUpdate(req.user.cart, { $set: { products: [] } }, { new: true });
        return res.status(200).send("Cart is empty!");
        // if (!update) return res.status(500).send("Internal Database Error");
    }

    if(productId){
        await Cart.findByIdAndUpdate(req.user.cart, { $pull: { products: { product: productId } } }, { new: true });
        return res.status(200).send("Product removed from cart!");
    }

    return res.status(204).send("No products in cart!");
}