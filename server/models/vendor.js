const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
	userId: { 
		type: mongoose.Schema.Types.ObjectId,
		ref : "user",
		required: true,
	},
	storeName: {
		type: String,
		// required: true,
	},
	storeAddress: {
		type: String,
		// required: true,
	},
	// gstNumber: {
	// 	type: String,
	// },
});

// Auto-delete products when stock is 0
// this is one way to do it... there can be more ways

module.exports = mongoose.model("vendor", vendorSchema);