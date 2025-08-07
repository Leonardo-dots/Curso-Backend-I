const ProductManager = require("./dao/ProductManager");
const express = require("express");
const app = express();
const PORT = 8080;

const productManager = new ProductManager();
productManager.loader();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Home del server")
})

app.get("/api/products", (req, res) =>{
    res.send("Apartado Products")
    const productos = productManager.getProducts()
    res.status(200).json(productos);
})

app.get("/api/products/:pid", (req, res) =>{
    const id = Number(req.params.pid);
    try{
        const producto = productManager.getProductByID(id);
        res.json(producto)
    }
    catch(error){
        res.status(404).json({error: error.message })
    }
})

app.post("/api/products", (req, res) =>{
    try{
        productManager.addProduct(req.body)
        res.status(201).json({mensaje: "producto agregado exitosamente."})
    }
    catch(error){
        if(error.message.includes("campos")){
            res.status(400).json({error: error.message})
        } else if(error.message.includes("codigo")){
            res.status(409).json({error: error.message})
        }
    }
})

app.put("/api/products/:pid", (req, res) =>{
    try{
        const id = Number(req.params.pid);
        const newProd = req.body
        if(isNaN(id)){
            throw new Error("Ingrese un ID numerico valido");
    }
    productManager.changeProduct(id, newProd)
    res.status(200).json({mensaje: "Producto Actualizado correctamente"})
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
    
})

app.delete("/api/products/:pid", (req, res) =>{
    try{
        const id = Number(req.params.pid);
        if(isNaN(id)){
            throw new Error("Ingrese un ID numerico valido");
        }
        const eliminado = productManager.deleteProduct(id);
        res.status(200).json({mensaje: `haz eliminado el siguiente producto`, producto: eliminado})
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
})

app.get("/api/carts", (req, res) =>{
    res.send("Apartado Cards")
})

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})