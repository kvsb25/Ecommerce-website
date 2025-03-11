const User = require("../models/user.js");
const Vendor = require("../models/vendor.js");
// const mongoose = require("mongoose");
const {fetchVendorDetailsFromDB} = require("../utils/vendor.js");
const {setCache} = require("../utils/redisCache.js");

module.exports.updateProfile = async (req, res) => {
    let { model, field, fieldUpdateValue } = req.query; // model specifies user or vendor, field specifies the field to be updated, fieldUpdateValue specifies the update to be made

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
    const updatedUser = await fetchVendorDetailsFromDB(req.user.user);
    await setCache(`vendor:${req.user.userId}`, updatedUser);
    return res.sendStatus(200);
}