const CartManager = require("./dao/CartManager");
const ProductManager = require("./dao/ProductManager");
const express = require("express");
const CartRoutes = require("./routes/CartRoutes");
const ProductRoutes = require("./routes/ProductRoutes");
const app = express();
const PORT = 8080;

const productManager = new ProductManager();
const cartManager = new CartManager();

//Cargamos los datos de los JSON.
(async () => {
    await productManager.loader();
    await cartManager.loader();
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`)
    });
})();

app.use(express.json());
app.use("/api/products", ProductRoutes(productManager));
app.use("/api/carts", CartRoutes(productManager, cartManager));

app.get("/", (req, res) => {
    res.send("Home del server")
})
