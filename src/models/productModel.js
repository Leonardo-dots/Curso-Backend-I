const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

//Schema.
const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, maxlength: 300 },
    price: { type: Number, required: true, min: 0 },
    thumbnails: { type: String, required: true },
    code: { type: Number, required: true, unique: true },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true }
});

// Aplicar el plugin al schema
productSchema.plugin(mongoosePaginate);

// Crear el model
const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
