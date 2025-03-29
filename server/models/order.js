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
			required: true,
		},
		qty: {
			type: Number,
			required: true,
			min: [1, "Quantity of the product must be at least 1"],
			default: 1,
		},
	}],
	status:{
		type: String,
		enum: ["successful", "pending", "canceled", "delivered"],
		required: true,
	},
	// delivered: {
	// 	type: Boolean,
	// 	required: true,
	// 	default: false,
	// },
	total: {
		type: Number,
		required: true,
		default: 0,
		min: 0,
	},
	// amount: {
	// 	type: Number,
	// 	required: true,
	// 	default: 0,
	// 	min: 0,
	// }
}, { timestamps: true });

// Prevent saving if `products` is empty
orderSchema.path("products").validate(function (value) {
	return value.length > 0;
}, "Order must contain at least one product.");

module.exports = mongoose.model("order", orderSchema);