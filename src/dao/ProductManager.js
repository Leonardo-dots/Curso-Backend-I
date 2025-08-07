// Clase para gestionar prodcutos, agregar, modificar o eliminar.
class ProductManager {
    #productos
    #idProduct
    constructor(){
        //Productos en el Carrito.
        this.#productos = [];

        // Variable Autoincreimentable ID
        this.#idProduct = 1;
    }
    addProduct(producto){
        //Validacion del producto. Que cumpla todos los campos.
        if(!producto.title || !producto.description || !producto.price || !producto.thumbnails || !producto.code || !producto.stock || !producto.status || !producto.category){
            throw new Error("Todos los campos son necesarios");
        }
        // Validacion de la existencia de producto a agregar.
        if(this.#productos.find(prod => prod.code === producto.code)){
           throw new Error("No se puede agregar un producto con mismo numero de Codigo");
        }
        let prodFinal = {id: this.#idProduct++, ...producto}
        this.#productos.push(prodFinal);
    }

    getProducts(){
        return this.#productos;
    }

    getProductByID(id){
        const producto = this.#productos.find(prod => prod.id === id);
        if(!producto){
            throw new Error("No se ha encontrado el producto");
        }
        return producto
    }
    changeProduct(prodId, newProd){

        let productoOriginal = this.getProductByID(prodId);

        if (typeof newProd !== 'object' || Array.isArray(newProd) || newProd === null){
            throw new Error("El producto no es un valor de tipo object");
        }
        if(newProd.id){
            throw new Error("El producto no debe contener una propiedad ID");
        }
         
        const producto = this.#productos.find(prod => prod.id === productoOriginal.id);
        Object.assign(producto, newProd);
    }

    deleteProduct(prodId){
        const producto = this.getProductByID(prodId) //validacion de que exista el ID
        this.#productos = this.#productos.filter(prod => prod.id !== prodId)
        return producto;
    }
}

module.exports = ProductManager;