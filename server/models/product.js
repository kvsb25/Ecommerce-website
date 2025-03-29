const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	type : {
		type: String,
		enum: ['x', 'y', 'z', 'a', 'b', 'c'],
		required: true,
	},
	price: {
		type: Number,
		min: 0,
		max: 999999,
		required: true,
		default: 0,
	},
	stock: {
        type: Number,
        required: true,
        min: 0, // Prevent negative stock
        default: 0
	},
	description: {
		type: String,
		required: true,
	},
	details:{
		type: Map,
		of: String,
		required: true,
	},
	vendor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "vendor",
	}
});

// if a product gets deleted then it gets deleted from all the carts it was part of
productSchema.pre("findOneAndDelete", async function(next) {
    const productId = this.getQuery()._id; // Get product ID being deleted
    await mongoose.model("cart").updateMany(
        { "products.product": productId }, 
        { $pull: { products: { product: productId } } }
    );
    next();
});

module.exports = mongoose.model("product", productSchema);