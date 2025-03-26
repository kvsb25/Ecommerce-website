const User = require("../models/user.js");
const Vendor = require("../models/vendor.js");
// const mongoose = require("mongoose");
const { fetchVendorDetailsFromDB } = require("../utils/vendor.js");
const { setCache } = require("../utils/redisCache.js");
const Products = require("../models/product.js");

module.exports.updateProfile = async (req, res) => {
    let { model, field, fieldUpdateValue } = req.query; // model specifies user or vendor, field specifies the field to be updated, fieldUpdateValue specifies the update to be made

    if(model || field || fieldUpdateValue) return res.sendStatus(400);
    // console.log(`model: ${model}, field: ${field}, fieldUpdateValue: ${fieldUpdateValue}`);

    // update field with fieldUpdateValue
    if (model == 'user') {
        await User.findByIdAndUpdate(req.user.userId, { $set: { [field]: fieldUpdateValue } }); // using computed property name to dynamically determine which field is to be updated
    } else if (model == 'vendor') {
        await Vendor.findByIdAndUpdate(req.user._id, { $set: { [field]: fieldUpdateValue } });
    } else {
        return res.sendStatus(400);
    }

    // keeping cached data up to date
    try{
        const updatedUser = await fetchVendorDetailsFromDB(req.user.user);
        await setCache(`vendor:${req.user.userId}`, updatedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    return res.sendStatus(200);
}

module.exports.getProductsOfVendor = async (req, res) => {
    console.log(req.body);
    const products = await Products.find({ vendor: req.user._id });
    console.log(products); // array of products

    if(products.length == 0) return res.sendStatus(404);

    return res.send(products); //products belonging to vendor
}

module.exports.addNewProduct = async (req, res) => {
    // add product belonging to vendor
    console.log(req.body);
    const newProduct = new Products({ ...req.body, vendor: req.user._id });
    if (!(await newProduct.save())) return res.sendStatus(500);
    // console.log(newProduct);
    res.send("httpStatus");
}

module.exports.newProductFormPage = (req, res) => {
    res.send("new product form page");
}

module.exports.getProductDetails = async (req, res) => {
    const { productId } = req.params;
    if(!productId) return res.sendStatus(400);
    const productDetails = await Products.findById(productId);
    if(!productDetails) return res.sendStatus(404);
    console.log(productDetails);
    return res.send(productDetails);
}

module.exports.updateProductDetails = async (req, res) => {
    const { field, fieldUpdate } = req.query;
    const { productId } = req.params;
    if(!field || !fieldUpdate || !productId) return res.sendStatus(400);
    console.log(`field: ${field}; fieldUpdate: ${fieldUpdate}; productId: ${productId}`);
    const update = await Products.findByIdAndUpdate(productId, { $set: { [field]: fieldUpdate } }, { new: true });
    // update product details
    // use query string to specify what detail of a product to update
    if(!update) return res.sendStatus(500);
    res.sendStatus(200);
}

module.exports.deleteProduct = async (req, res) => {
    // delete product by productId
    const { productId } = req.params;
    if(!productId) return res.sendStatus(400);
    await Products.findByIdAndDelete(productId);
    res.send("httpStatus");
}