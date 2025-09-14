const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");

class CartManager{
    
    //Crear Carrito
    static async addCart(){
        try{
            const newCart = await cartModel.create({});
            return newCart;
        } catch(error){
            throw new Error(error.message); 
        }
    }

    //Encontrar Carrito por ID
    static async getCartById(id){
        try{
            const cartfound = await cartModel.findById(id).populate("products.product").lean(); //populate para que rellene los datos y no se vea el "_id".
            if(!cartfound) throw new Error("Carrito no encontrado");
            return cartfound;
        } catch(error){
            throw new Error(error.message);
        }
    }

    //Agregar un producto a un Carrito
    static async addProductToCart(cid, pid){
        try{
            //Busqueda y validacion del producto
            const product = await productModel.findById(pid);
            if(!product) throw new Error("Producto no Encontrado");

            //Busqueda y validacion del carrito.
            const cart = await cartModel.findById(cid);
            if(!cart) throw new Error("Carrito no encontrado");

            //Verificacion si el producto ya existen en el carrito
            const existProduct = cart.products.find(p => p.product.toString() === pid);
            if(existProduct){
                existProduct.quantity += 1;
            } else {
                cart.products.push({product: product._id, quantity: 1}); //El Quantity esta por las dudas, en realidad ya esta definido en el schema por defecto.
            }
            return await cart.save();
        } catch(error){
            throw new Error(error.message);
        }
    }

    //Eliminar un producto en el carrito.
    static async deleteProductInCart(cid, pid){
        try{
            //Busqueda y validacion del producto
            const product = await productModel.findById(pid);
            if(!product) throw new Error("Producto no Encontrado");

            //Busqueda y validacion del carrito.
            const cart = await cartModel.findById(cid);
            if(!cart) throw new Error("Carrito no encontrado");

            //Busqueda del producto dentro de cart, si existe se elimina, sino se lanza un error.
            const existProduct = cart.products.findIndex(p => p.product.toString() === pid);
            if(existProduct !== -1){
                cart.products.splice(existProduct, 1);
                return await cart.save();
            } else {
                throw new Error("Producto no encontrado en el carrito");
            }
        } catch(error){
            throw new Error(error.message);
        }
    }

    //Actualizar un carrito con un Array.
    static async addManyProductsToCart(cid, productos){
        try{
            //Busqueda y validacion del carrito.
            const cart = await cartModel.findById(cid);
            if(!cart) throw new Error("Carrito no encontrado");

            //verificamos que llegue un array
            if(!Array.isArray(productos)) throw new Error("Se debe ingresar un Array para la actualizacion");

            //actualizacion de los productos al nuevo array ingresado.
            cart.products = productos;
            return await cart.save();

        } catch(error){
            throw new Error(error.message);
        }
    }

    //Actualizar cantidad de un producto en el carrito
    static async updateQuantity(cid, pid, quantity){

        //Busqueda y validacion del carrito.
        const cart = await cartModel.findById(cid);
        if(!cart) throw new Error("Carrito no encontrado");

        const prodIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if(prodIndex === -1) throw new Error("Producto no encontrado en el carrito");

        //quantity tiene que ser un valor numerico mayor que 0
        if(quantity <= 0 || typeof quantity !== "number") throw new Error("La cantidad modificada debe ser mayor a 0");

        cart.products[prodIndex].quantity = quantity;
        return await cart.save();

    }

    //Vaciar un carrito
    static async cartClean(cid){
        try{
            //Busqueda y validacion del carrito.
            const cart = await cartModel.findById(cid);
            if(!cart) throw new Error("Carrito no encontrado");

            //Vaciando el carrito.
            cart.products = [];
            return await cart.save();

        } catch(error){
            throw new Error(error.message);
        }
    }
}

module.exports = CartManager;