const express = require("express");
const path = require("path");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const {engine} = require("express-handlebars");
const cartRoutes = require("./routes/cartRoutes");
const ProductManager = require("./dao/ProductManager");

//inicializacion del servidor.
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

//Hago la importacion despues de definir "io" para evitar errores y asegurar que este definido antes.
const productRoutes = require("./routes/productRoutes")(io);

//conexion a MongoDB Atlas
(async ()=>{
    try{
        await mongoose.connect("mongodb+srv://Leonardo:CoderHouse@cluster.4t8msl5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster");
        console.log("Conectado correctamente a MongoDB");
    } catch(error) {
        console.log(error.message);
        process.exit(1);
    }
})();

//Middlewares
app.use(express.json());

//Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

//Config handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//Escucha de nuevas conexiones en el servidor.
io.on("connection", (socket)=>{
    console.log("Nuevo usuario conectado mediante WebSocket");

    socket.on("disconnect", ()=>{
        console.log("usuario desconectado");
    })
});

app.get("/", (req, res) =>{
    res.render("home")
})

app.get("/realTimeProducts", async(req, res)=>{
    try{
        const productos = await ProductManager.getProducts();
        res.status(200).render("realTimeProducts", {productos});
    } catch(error){
        res.status(500).json({error: error.message});
    }
})

server.listen(PORT, ()=> console.log(`Servidor corriendo en localhost:${PORT}`));