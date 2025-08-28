const {Router} = require("express");

module.exports = (productManager, io) =>{

    const router = Router();

    router.get("/", (req, res) =>{
        const productos = productManager.getProducts();
        res.status(200).render("realTimeProducts", {productos});
    })
    return router;
}