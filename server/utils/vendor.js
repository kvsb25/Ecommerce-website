const { getOrSetCache } = require("./redisCache.js");
const mongoose = require("mongoose")
const Vendor = require("../models/vendor.js");

module.exports.fetchVendorDetails = async (user) => {
    const vendorDetails = await getOrSetCache(`vendor:${user._id}`,() => this.fetchVendorDetailsFromDB(user) /*async (user) => {
        console.log("in callback")
        const vendorDetails = await Vendor.aggregate([
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
    
        console.log('Vendor details in callback' + vendorDetails);
        console.log('going out of callback');
        return vendorDetails;
    }*/);
    // console.log(vendorDetails);
    return vendorDetails[0];
}

module.exports.fetchVendorDetailsFromDB = async (user) => {
    console.log("in callback");
    console.log("user: "+user);
    console.log("user.id: "+user.id+" user._id: "+user._id );
    const vendorDetails = await Vendor.aggregate([
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

    console.log('Vendor details in callback' + vendorDetails);
    console.log('going out of callback');
    return vendorDetails;
}