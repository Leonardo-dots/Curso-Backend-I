const mongoose = require("mongoose");

const cartModel = mongoose.model("Cart", new mongoose.Schema({
    product:[{
        products: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
        quantity: {type: Number, default: 1}
    }],
}, {timestamps: true}))

module.exports = cartModel;