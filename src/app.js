const CartManager = require("./dao/CartManager");
const ProductManager = require("./dao/ProductManager");
const CartRoutes = require("./routes/CartRoutes");
const ProductRoutes = require("./routes/ProductRoutes");
const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");
const realTimeProducts = require("./routes/realTimeProducts");


const app = express();
const PORT = 8080;
const server = http.createServer(app);
const io = new Server(server);


const productManager = new ProductManager();
const cartManager = new CartManager();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//Cargamos los datos de los JSON.
(async () => {
    await productManager.loader();
    await cartManager.loader();
    server.listen(PORT, () => {
        console.log(`Servidor corriendo en localhost:${PORT}`)
    });
})();

app.use(express.json());
app.use("/api/products", ProductRoutes(productManager, io));
app.use("/api/carts", CartRoutes(productManager, cartManager));
app.use("/realtimeproducts", realTimeProducts(productManager, io));

app.get("/", (req, res) => {
    res.render("home");
})
