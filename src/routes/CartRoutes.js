const {Router} = require("express");

//tengo que exportar una funcion contructora del Router para poder usar la misma intancia de la clase que tengo en App y no crear distintas instancias y cada una tenga datos diferentes.
module.exports = (productManager, cartManager) =>{
    const router = Router();

    //Obtener un carrito por ID
    router.get("/:cid", (req, res)=>{
        try{
            const id = Number(req.params.cid);
            const cart = cartManager.getCartByID(id);
            res.status(200).json(cart)
        }
        catch(error){
            res.status(404).json({error: error.message});
        }
    })

    //crear un nuevo carrito.
    router.post("/", async (req, res) => {
        try{
            await cartManager.addCart();
            res.status(201).json({mensaje: "carrito creado correctamente"});
        }
        catch(error){
            res.status(500).json({error: error.message})
        }
    })

    router.post("/carts/:cid/product/:pid", async(req, res)=>{
        try{
            const cid = Number(req.params.cid);
            const pid = Number(req.params.pid);
            await cartManager.addProductoToCart(cid, pid, productManager);
            res.status(201).json({mensaje: "Producto Agregado al carrito correctamente"})
        }
        catch(error){
            res.status(400).json({error: error.message})
        }
    })
    
    return router;
}