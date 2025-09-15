const productModel = require("../models/productModel");

class ProductManager {

    // //devolucion todos los productos
    // static async getProducts(){
    //     return await productModel.find().lean();
    // }

    //devolucion de los productos con paginate y uso de querys como filtros u opciones.
    static async getProducts({page = 1, limit = 10, sort, query}){

        //filtro del paginate por el parametro query
        const filter = {};
        if(query) filter.category = query;

        //opciones del paginate
        const options = {
            page: Number(page),
            limit: Number(limit),
            sort: sort ? {price: Number(sort)} : {},
            lean: true,
        }

        return await productModel.paginate(filter, options);
    }

    //devolucion un producto por ID
    static async getProductById(id){
        try{
            const producto = await productModel.findById(id).lean();
            if(!producto) throw new Error("Producto no encontrado");
            return producto
        } catch(error){
            throw new Error(error.message);
        }
        
    }

    //Agregacion de Productos a la coleccion
    static async addProduct(producto){
        try{
            const nuevoProd = await productModel.create(producto);
            return nuevoProd;
        }
        catch(error){
            throw new Error(error.message);
        }
    }

    //Actualizacion de producto por ID
    static async changeProduct(prodId, update){
        try{
            const actualizado = await productModel.findByIdAndUpdate(prodId, update, {new: true}).lean(); //opcion para devolver el documento actualizado.
            if(!actualizado) throw new Error("No se a podido encontrar o modificar el producto");
            return actualizado;
        }
        catch(error){
            throw new Error(error.message);
        }
    }

    //Eliminacion de Producto por ID.
    static async deleteProduct(prodId){
        try{
            const eliminado = await productModel.findByIdAndDelete(prodId).lean();
            if(!eliminado) throw new Error("No se a podido encontrar y eliminar el producto");
            return eliminado;
        }
        catch(error){
            throw new Error(error.message);
        }
    }
}

module.exports = ProductManager;