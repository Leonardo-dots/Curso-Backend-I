const path = require("path");
const fs = require("fs/promises")

require("fs/promises");
require("path");

class CartManager{
    #cartId
    #carts
    #path

    constructor(){
        this.#path = path.join(__dirname, "carts.json");
        this.#carts = [];
        this.#cartId = 1
    }

    //verificacion de length de carritos y actualizacion
    async loader(){
        try{
            await fs.access(this.#path)
            const data = await fs.readFile(this.#path, "utf-8");
            this.#carts = JSON.parse(data);

            if(this.#carts.length > 0){
                this.#cartId = this.#carts[this.#carts.length - 1].id + 1;
            }
        }
        catch(error){
            console.log("no se encontraron carritos guardados");
            this.#carts = []
        }
    }

    async addCart() {
        const nuevoCarrito = {id: this.#cartId++, products: []};

        this.#carts.push(nuevoCarrito);

        try {
            await fs.writeFile(this.#path, JSON.stringify(this.#carts));
        } 
        catch (error) {
            console.log("Error al guardar el carrito:", error.message);
        }
    }

    getCartByID(id){
        const cart = this.#carts.find(cart => cart.id === id)
        if(!cart){
            throw new Error("No se encontro el carrito con el ID indicado.")
        }
        return cart;
    }


    async addProductoToCart(cartID, productID, productManager){
        const cart = this.getCartByID(cartID);
        let product;

        try{
            product = productManager.getProductByID(productID);
        }
        catch(error){
            console.log(error.message);
        }

        const inCart = cart.products.find(prod => prod.productID === product.id)

        if(inCart){
            inCart.quantity++;
        } else {
            cart.products.push({ productID: product.id, quantity: 1 });
        }

        try{
            await fs.writeFile(this.#path, JSON.stringify(this.#carts))
        }
        catch(error){
            throw new Error("Error al guardar en el carrito");
        }
    }
}

module.exports = CartManager;