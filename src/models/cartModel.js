const mongoose = require("mongoose");

const cartModel = mongoose.model("Cart", new mongoose.Schema({
    products:[{
        product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
        quantity: {type: Number, default: 1}
    }],
}, {timestamps: true}))

module.exports = cartModel;