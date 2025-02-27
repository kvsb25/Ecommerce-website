const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    // owner:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "customer",
    // },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
        },
        qty: {
            type: Number,
            required: true,
            min: 1, // implement logic: remove product from cart if qty == 0
        },
    }],
})

// function to remove products with qty == 0
// async function removeZeroQtyProducts(cartId) {
//     await Cart.findByIdAndUpdate(cartId, { $pull: { products: { qty: 0 } } }, {new : true});
// }

module.exports = mongoose.model("cart", cartSchema);