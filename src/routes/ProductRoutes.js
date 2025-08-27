const {Router} = require("express");

//tengo que exportar una funcion contructora del Router para poder usar la misma intancia de la clase que tengo en App y no crear distintas instancias y cada una tenga datos diferentes.
module.exports = (productManager) => {
    const router = Router();

//Acceder a todos los productos.
router.get("/", (req, res) =>{
    const productos = productManager.getProducts();
    res.status(200).json(productos);
})

//Acceder a un producto por ID
router.get("/:pid", (req, res) =>{
    //
    const id = Number(req.params.pid);

    if(isNaN(id)){
        throw new Error("Ingrese un valor ID numerico.");
    }

    try{
        const producto = productManager.getProductByID(id);
        res.json(producto);
    } 
    catch(error) {
        res.status(404).json({error: error.message})
    }
})

//Agrega un producto.
router.post("/", async (req, res) =>{
    try{
        const productoAgregado = await productManager.addProduct(req.body);
        res.status(201).json({mensaje: "Producto Agregado correctamente", producto: productoAgregado});
    }
    catch(error){
        if(error.message.includes("campos")){
            res.status(400).json({error: error.message})
        } else if(error.message.includes("codigo")){
            res.status(409).json({error: error.message})
        } else{
            res.status(500).json({error: error.message})
        }
    }
})

//modificacion de producto
router.put("/:pid", async (req, res) =>{

    try{
        //datos de la request
        const newProd = req.body
        const id = Number(req.params.pid);

        if(isNaN(id)){
            throw new Error("Ingrese un valor ID numerico")
        }

        //Modificacion del producto.
        const {productoOriginal, producto} = await productManager.changeProduct(id, newProd)
        res.status(200).json({mensaje: "Producto Actualizado correctamente", producto_original: productoOriginal, producto_modificado: producto})
    }
    catch(error){
        if(error.message.includes("dato")){
            res.status(400).json({mensaje: error.message})
        } else{
            res.status(500).json({error: error.message});
        }
    }
})

//Elimina un producto.
router.delete("/:pid", async(req, res) =>{
    try{
        const id = Number(req.params.pid);
        if(isNaN(id)){
            throw new Error("Ingrese un valor ID numerico")
        }
        const eliminado = await productManager.deleteProduct(id);
        res.status(200).json({mensaje: "haz eliminado el siguiente producto.", producto: eliminado});
    }
    catch(error){
        res.status(400).json({error: error.message})
    }
})
return router;
}
