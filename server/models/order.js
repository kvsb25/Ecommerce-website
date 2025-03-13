const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "customers",
		required: true,
	},
	products:[{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "products",
		},
		qty: {
			type: Number,
			required: true,
			min: 1
		},
	}],
	status:{
		type: String,
		enum: ["successful", "pending", "canceled", "delivered"],
		required: true,
	},
	delivered: {
		type: Boolean,
		required: true,
		default: false,
	},
	total: {
		type: Number,
		required: true,
		default: 0,
		min: 0,
	}
});

module.exports = mongoose.model("order", orderSchema);