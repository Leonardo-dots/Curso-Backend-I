// Clase para gestionar prodcutos, agregar, modificar o eliminar.
const fs = require("fs/promises");
const path = require("path");

class ProductManager {
    #productos
    #idProduct
    #path
    constructor(){
        //ruta de la ubicacion de los productos
        this.#path = path.join(__dirname, "products.json")
        //Productos en el Carrito.
        this.#productos = [];

        // Variable Autoincreimentable ID
        this.#idProduct = 1;
    }
    //metodo para cargar productos guardados en JSON
    async loader(){
        try{
            await fs.access(this.#path)
            const data = await fs.readFile(this.#path, "utf-8");
            this.#productos = JSON.parse(data);

            if(this.#productos.length > 0){
                this.#idProduct = this.#productos[this.#productos.length - 1].id + 1;
            }
        }
        catch(error){
            console.log("No se encontraron productos");
            this.#productos = [];
        }
    }
    
    //Agregar productos
    async addProduct(producto){
        //Validacion del producto. Que cumpla todos los campos.
        const required = ["title", "description", "price", "thumbnails", "code", "stock", "category"];
        for(let req of required){
            if(!producto[req] && producto[req] !== 0){
                throw new Error("Todos los campos son necesarios")
            }
        }

        // Validacion de la existencia de producto a agregar.
        if(this.#productos.find(prod => prod.code === producto.code)){
           throw new Error("No se puede agregar un producto con mismo numero de Codigo");
        }

        //filtrar el producto para quedarme con los campos que quiero.
        let prodFiltrado = {};
        for(let campo of required){
            prodFiltrado[campo] = producto[campo];
        }

        //Crear el nuevo producto.
        let prodFinal = {id: this.#idProduct++, ...prodFiltrado}
        this.#productos.push(prodFinal);

        try{
            await fs.writeFile(this.#path, JSON.stringify(this.#productos));
        }
        catch(error){
            console.log(error.message);
        }
        return prodFinal;
    }

    // Devuelve TODOS los productos
    getProducts(){
        return this.#productos;
    }

    //Devuelve un producto por ID
    getProductByID(id){
        const producto = this.#productos.find(prod => prod.id === id);
        if(!producto){
            throw new Error("No se ha encontrado el producto");
        }
        return producto
    }

    //Modifica un Producto.
    async changeProduct(prodId, newProd){

        let productoOriginal = {...this.getProductByID(prodId)}; //Uso Spread operator para copiar el objeto y poder devolverlo en el return.

        if (typeof newProd !== 'object' || Array.isArray(newProd) || newProd === null){
            throw new Error("El producto no es un dato de tipo object");
        }

        //Nuevamente filtro el producto para quedarme con los campos que necesito.
        const required = ["title", "description", "price", "thumbnails", "code", "stock", "category"];
        let prodFiltrado = {};
        for(let campo of required){
            if(newProd[campo] !== undefined)
            prodFiltrado[campo] = newProd[campo];
        }

        const producto = this.#productos.find(prod => prod.id === productoOriginal.id);
        Object.assign(producto, prodFiltrado);

        try{
            await fs.writeFile(this.#path, JSON.stringify(this.#productos));
        }
        catch(error){
            console.log(error.message);
        }
        return {productoOriginal, producto};
    }


    //Elimina un producto.
    async deleteProduct(prodId){
        const producto = this.getProductByID(prodId) //validacion de que exista el ID
        this.#productos = this.#productos.filter(prod => prod.id !== prodId)

        try{
            await fs.writeFile(this.#path, JSON.stringify(this.#productos));
        }
        catch(error){
            console.log(error.message);
        }

        return producto;
    }
}

module.exports = ProductManager;