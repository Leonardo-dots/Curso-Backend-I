import ProductModel from "../models/productModels"

class ProductManager {

    //devolucion todos los productos
    static async getProducts(){
        return await ProductModel.find().lean();
    }

    //devolucion un producto por ID
    static async getProductById(id){
        try{
            const producto = await ProductModel.findById(id).lean();
            if(!producto) throw new Error("Producto no encontrado");
            return producto
        } catch(error){
            throw new Error(error.message);
        }
        
    }

    //Agregacion de Productos a la coleccion
    static async addProduct(producto){
        try{
            const nuevoProd = await ProductModel.create(producto).lean();
            return nuevoProd;
        }
        catch(error){
            throw new Error(error.message);
        }
    }

    //Actualizacion de producto por ID
    static async changeProduct(prodId, update){
        try{
            const actualizado = await ProductModel.findByIdAndUpdate(prodId, update, {new: true}).lean(); //opcion para devolver el documento actualizado.
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
            const eliminado = await ProductModel.findByIdAndDelete(prodId).lean();
            if(!eliminado) throw new Error("No se a podido encontrar y eliminar el producto");
            return eliminado;
        }
        catch(error){
            throw new Error(error.message);
        }
    }
}

module.exports = ProductManager;