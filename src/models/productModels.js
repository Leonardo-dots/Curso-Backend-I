const mongoose = require("mongoose");

const ProductModel = mongoose.model("Product", new mongoose.Schema({
    title: {type: String, required: true, trim: true},
    description: {type: String, required: true, maslength: 300},
    price: {type: Number, required: true, min: 0},
    thumbnails: {type: String, required: true},
    code: {type: Number, required: true, unique: true},
    stock: {type: Number, required: true, min: 0},
    category: {type: String, required: true}
}))

module.exports = ProductModel;