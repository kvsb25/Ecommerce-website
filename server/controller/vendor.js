const User = require("../models/user.js");
const Vendor = require("../models/vendor.js");
// const mongoose = require("mongoose");
const { fetchVendorDetailsFromDB } = require("../utils/vendor.js");
const { setCache } = require("../utils/redisCache.js");
const Products = require("../models/product.js");
const Orders = require("../models/order.js");

module.exports.updateProfile = async (req, res) => {
  let { model, field, fieldUpdateValue } = req.query; // model specifies user or vendor, field specifies the field to be updated, fieldUpdateValue specifies the update to be made

  if (model || field || fieldUpdateValue) return res.sendStatus(400);
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
  try {
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

  if (products.length == 0) return res.sendStatus(404);

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
  if (!productId) return res.sendStatus(400);
  const productDetails = await Products.findById(productId);
  if (!productDetails) return res.sendStatus(404);
  console.log(productDetails);
  return res.send(productDetails);
}

module.exports.updateProductDetails = async (req, res) => {
  const { field, fieldUpdate } = req.query;
  const { productId } = req.params;
  if (!field || !fieldUpdate || !productId) return res.sendStatus(400);
  console.log(`field: ${field}; fieldUpdate: ${fieldUpdate}; productId: ${productId}`);
  const update = await Products.findByIdAndUpdate(productId, { $set: { [field]: fieldUpdate } }, { new: true });
  // update product details
  // use query string to specify what detail of a product to update
  if (!update) return res.sendStatus(500);
  res.sendStatus(200);
}

module.exports.deleteProduct = async (req, res) => {
  // delete product by productId
  const { productId } = req.params;
  if (!productId) return res.sendStatus(400);
  await Products.findByIdAndDelete(productId);
  res.send("httpStatus");
}

module.exports.getOrdersOfVendor = async (req, res) => {
  // get all orders of vendor
  // const orders = await Orders.find({ vendor: req.user._id });
  // const orders = await Orders.find({ "products.product.vendor": req.user._id }).populate('customer').populate({ path: 'products.product', populate: { path: 'vendor', match: { _id: { $eq: req.user._id } } } });

  // Approach 1
  // const orders = await Orders.find({
  //   "products": {
  //     $elemMatch: {
  //       "product.vendor": req.user._id
  //     }
  //   }
  // })
  //   .populate('customer')
  //   .populate({
  //     path: 'products.product',
  //     populate: {
  //       path: 'vendor',
  //       // match: { _id: { $eq: req.user._id } }
  //     }
  //   });

  // Approach 2
  // const orders = await Orders.find({'products.product.vendor' : req.user._id})
  //   .populate('customer')
  //   .populate({
  //     path: 'products.product',
  //     populate:{
  //       path:'vendor'
  //     }
  //   })

  // Approach 3
  // const orders = await Orders.find()
  // .populate({
  //   path: 'products.product',
  //   match: { vendor: req.user._id },
  //   populate: { path: 'vendor' }
  // })
  // .populate('customer')

  // Approach 4
  // const orders = await Orders.find({ "products.product": { $in: await Products.find({ vendor: req.user._id }).distinct('_id') } })
  //   .populate('customer')
  //   .populate({
  //     path: 'products.product',
  //     populate: {
  //       path: 'vendor'
  //     }
  //   });

  // console.log(orders);
  // if (!orders) return res.sendStatus(404);

  // orders.forEach(order => {
  //   order.products = order.products.filter(p => p.product !== null);
  // });

  // const vendorSalesOrders = orders.reduce((acc, order) => {
  //   const vendorSpecificProducts = order.products.filter(
  //     item => item.product.vendor._id.toString() === req.user._id.toString()
  //   );

  //   if (vendorSpecificProducts.length > 0) {
  //     acc.push({
  //       customer: order.customer,
  //       products: vendorSpecificProducts.map(item => ({
  //         product: item.product,
  //         quantity: item.qty
  //       }))
  //     });
  //   }

  //   return acc;
  // }, []);

  // Approach 5
  const vendorProductIds = await Products.find({ vendor: req.user._id }).distinct('_id');

  const orders = await Orders.find({ "products.product": { $in: vendorProductIds } })
    .populate({
      path: 'products.product',
      populate: { path: 'vendor' }
    })
    .populate('customer')
    .lean();

  // If no orders found
  if (!orders || orders.length === 0) return res.sendStatus(404);

  const vendorSalesOrders = orders
    .map(order => ({
      amount: order.total,
      status: order.status,
      customer: order.customer,
      products: order.products
        .filter(p =>
          p.product &&
          p.product.vendor &&
          p.product.vendor._id.toString() === req.user._id.toString()
        )
        .map(item => ({
          product: item.product,
          quantity: item.qty
        }))
    }))
    .filter(orderData => orderData.products.length > 0);
  // test this
  // const result = orders.map(order => {
  //     return {
  //         orderId: order._id,
  //         customerName: order.customer.name,
  //         customerAddress: order.customer.address,
  //         customerPhone: order.customer.phone,
  //         products: order.products.map(product => {
  //             if (product.vendor._id == req.user._id) {
  //                 return {
  //                     productId: product.product,
  //                     qty: product.qty
  //                 }
  //             }
  //         }),
  //         status: order.status,
  //         delivered: order.delivered,
  //         total: order.total
  //     }
  // });
  console.log(vendorSalesOrders);

  return res.status(200).send(vendorSalesOrders); // array of orders belonging to vendor
}