const userModel = require("../models/userModels");
const CartManager = require("./CartManager");
const bcrypt = require("bcrypt");

module.exports = class UserManager{

    //Metodo registro de Usuarios
    static async userRegister(first_name, last_name, email, age, password, confirmPassword){
        if(password !== confirmPassword){
            throw new Error("Las contraseñas no coinciden");
        }
        const existUser = await userModel.findOne({ email });

        //Verificamos Email
        if(existUser){
            throw new Error("Este Email ya esta registrado");
        }
        
        //Creamos carrito para el usuario.
        const cart = await CartManager.addCart();

        //Nuevo usuario registrado
        const user = {
            first_name,
            last_name,
            email,
            age,
            password: await bcrypt.hash(password, 10),
            cart: cart._id,
            role: "user",
        }
        //subida a la DB
        const newUser = await userModel.create(user);
        return newUser;
    }
}