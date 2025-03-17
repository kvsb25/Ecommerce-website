const { fetchCustomerDetailsFromDB } = require("../utils/customer.js");
const { setCache } = require("../utils/redisCache.js");
const Customer = require("../models/customer.js");
const Cart = require("../models/cart.js");
const User = require("../models/user.js");

module.exports.updateProfile = async (req, res) => {
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

}

module.exports.getCustomerCart = async (req, res) => {   // cart/view will send get request to this route to get the customer's cart details
    const cart = await Cart.findById(req.user.cart);
    return res.status(200).json(cart.products);
}

module.exports.addProductToCart = async (req, res) => {
    // add product to customer's cart
    // send productId as query string

    const productId = req.query.productId;
    const quantity = Number(req.query.quantity) || 1;

    const cart = await Cart.findById(req.user.cart);
    console.log(`cart : ${cart}`);
    const existingProduct = cart.products?.find(p => p.product.toString() === productId); // returns that object in products array whose product (ObjectId('...')) is equal to productId

    if (!existingProduct) return res.status(500).send("Internal Server Error");
    if (existingProduct) {
        existingProduct.qty += quantity;
    } else {
        cart.products.push({ product: productId, qty: quantity });
    }

    await cart.save();
    return res.status(200).send('Cart Updated');
}

module.exports.updateCustomerCart = async (req, res) => {
    // update cart: qty of products in cart, or remove a product from cart
    // use query string to specify which detail of a cart/cart's product to update
    const productId = req.query.productId;
    const quantity = Number(req.query.quantity) || 1;
    const cart = await Cart.findById(req.user.cart);

    if (!cart) {
        throw new Error("cart not found");
    }

    const product = cart.products.find(p => p.product.toString() === productId);

    // if (productId || quantity || cart || product) return res.status(500).send("Internal Server Error");

    product.qty += quantity;

    await cart.save()

    await Cart.findByIdAndUpdate(req.user.cart, { $pull: { products: { qty: 0 } } });  //remove all the products with qty == 0

    return res.status(200).send("httpStatus");
}

module.exports.emptyCustomerCart = async (req, res) => {
    // empty the cart
    // remove all the products in the cart
    await Cart.findByIdAndUpdate(req.user.cart, { $set: { products: [] } });

    return res.status(200).send("cart emptied"); // make sure a mongoose middleware is declared for removing a product from cart if it's qty becomes 0
}