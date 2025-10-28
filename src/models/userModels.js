const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    age: {type: Number},
    authMethod: {type: String, enum: ["local", "github"], required: true, default: "local"}, //Lo uso para poder validar desde el schema que la contraseña sea requerida en caso de que el "AuthMethod" sea de forma local y no sea requerida cuando usamos una autenticacion "OAuth2"
    password: {type: String, required: function(){return this.authMethod === "local"} }, //funcion condicional dependiendo de "authMethod"
    cart: {type: mongoose.Schema.Types.ObjectId, ref: "Cart"},
    role: {type: String, required: true, enum: ["user", "admin"], default: "user"},
})

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;