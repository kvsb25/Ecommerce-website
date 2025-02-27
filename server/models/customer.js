const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    userId: { 
		type: mongoose.Schema.Types.ObjectId,
		ref : "user",
		required: true,
	},
	address: {
		type: String,
	},
	cart: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "cart",
	}
})

module.exports = mongoose.model("customer", customerSchema);