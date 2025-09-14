const { Router } = require("express");
const ProductManager = require("../dao/ProductManager");

//Exporto el router y pido un IO para usarlo en las rutas
module.exports = (io) => {

    const router = Router();
    
    //Devolucion de todos los productos
    router.get("/", async(req, res)=>{
        try{
            const productos = await ProductManager.getProducts();
            res.status(200).render("renderProducts", {productos});
        } catch(error){
            res.status(500).json({error: error.message});
        }
    })

    //devolucion de producto por ID
    router.get("/:pid", async(req, res) =>{
        try{
            const id = req.params.pid;
            const producto = await ProductManager.getProductById(id);
            res.status(200).render("renderProd", {producto});
        } catch(error){
            res.status(404).json({error: error.message});
        }
    })

    //Agregar un Producto
    router.post("/", async(req, res)=>{
        try{
            const productoAgregado = await ProductManager.addProduct(req.body);

            //Emision de evento para actualizar el sitio con conexion webScoket.
            io.emit("updateProduct", await ProductManager.getProducts());

            res.status(201).json({mensaje: "Producto Agregado correctamente", producto: productoAgregado});
        } catch(error){
            res.status(500).json({error: error.message});
        }
    })

    //Modificar un producto
    router.put("/:pid", async(req, res)=>{
        try{
            const prodActualizado = await ProductManager.changeProduct(req.params.pid, req.body);

            //Emision de evento para actualizar el sitio con conexion webScoket.
            io.emit("updateProduct", await ProductManager.getProducts());


            res.status(200).json({mensaje: "Producto actualizado correctamente",nuevoProducto: prodActualizado});
        } catch(error){
            res.status(404).json({mensaje: error.message});
        }
    })

    //Eliminar un producto
    router.delete("/:pid", async(req, res) =>{
        try{
            const deleted = await ProductManager.deleteProduct(req.params.pid);

            //Emision de evento para actualizar el sitio con conexion webScoket.
            io.emit("updateProduct", await ProductManager.getProducts());
            
            res.status(200).json({mensaje: "Producto eliminado correctamente", productoEliminado: deleted});
        } catch(error){
            res.status(500).json({mensaje: error.message});
        }
    })

    return router;
};
