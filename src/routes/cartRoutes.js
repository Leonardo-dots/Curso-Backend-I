const { Router } = require("express");
const router = Router();
const CartManager = require("../dao/CartManager");

//Ruta para crear un carrito
router.post("/", async(req, res)=>{
    try{
        const cartCreate = await CartManager.addCart();
        res.status(201).json({mensaje: "Carrito creado correctamente", carrito: cartCreate});
    } catch(error){
        res.status(500).json({error: error.message});
    }
});

//Ruta para encontrar un carrito por ID
router.get("/:cid", async(req, res)=>{
    try{
        const cartFound = await CartManager.getCartById(req.params.cid);
        res.status(200).render("cartView", {cartFound});
    } catch(error){
        res.status(404).json({error: error.message});
    }
});

//Ruta para agregar un producto a un carrito
router.post("/:cid/products/:pid", async(req, res)=>{
    try{
        const cartUpdate = await CartManager.addProductToCart(req.params.cid, req.params.pid);
        res.status(200).json({cartUpdate});
    } catch(error){
        res.status(404).json({error: error.message});
    }
})

//Ruta para eliminar un producto de un carrito
router.delete("/:cid/products/:pid", async(req, res)=>{
    try{
        const cart = await CartManager.deleteProductInCart(req.params.cid, req.params.pid);
        res.status(200).json({mensaje: "producto eliminado correctamente", carritoActualizado: cart});
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

//Ruta para actualizar un carrito mediante un array
router.put("/:cid", async(req, res)=>{
    try{
        const cart = await CartManager.addManyProductsToCart(req.params.cid, req.body.quantity);
        res.status(200).json({mensaje: "Carrito actualizado con los datos del array", cart});
    } catch(error){
        res.status(400).json({error: error.message});
    }
})

//Ruta para actualizar cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async(req, res)=>{
    try{
        const cart = await CartManager.updateQuantity(req.params.cid, req.params.pid, req.body);
        res.status(200).json({mensaje: "Cantidad de productos actualizadas", cart});
    } catch(error){
        res.status(404).json(error.message);
    }
})

//Ruta para vaciar el carrito
router.delete("/:cid", async(req, res) =>{
    try{
        const cart = await CartManager.cartClean(req.params.cid);
        res.status(200).json({mensaje: "Carrto vaciado", cart});
    } catch(error){
        res.status(500).json({error: error.message});
    }
})

module.exports = router;


