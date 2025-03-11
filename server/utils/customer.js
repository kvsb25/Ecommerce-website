const { getOrSetCache } = require("./redisCache.js");
const mongoose = require("mongoose")
const Customer = require("../models/customer.js");

// retrieve customer data from cache
module.exports.fetchCustomerDetails = async (user) => {
    const customerDetails = await getOrSetCache(`customer:${user._id}`, () => this.fetchCustomerDetailsFromDB(user));
    // console.log(vendorDetails);
    return customerDetails[0];
}

module.exports.fetchCustomerDetailsFromDB = async (user) => {
    console.log("in callback");
    console.log("user: " + user);
    console.log("user.id: " + user.id + " user._id: " + user._id);
    const customerDetails = await Customer.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },
        // { $match: { "user.username": req.user.username } }, // try to match this with user._id 
        { $match: { "user._id": new mongoose.Types.ObjectId(user._id) } },
        { $limit: 1 }
    ]);

    if(!customerDetails) return res.status(500).send("Internal Server error : {at fetchCustomerDetailsFromDB : { at /utils/customer.js}}");
    console.log('Customer details in callback' + customerDetails);
    console.log('going out of callback');
    return customerDetails;
}