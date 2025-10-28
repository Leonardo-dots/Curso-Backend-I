const express = require("express");
const path = require("path");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");
const passport = require("passport");
const passportConfig = require("./config/passportConfig");
const cookieParser = require("cookie-parser");

//import Rutas
const productManager = require("./dao/ProductManager");
const cartRoutes = require("./routes/cartRoutes");
const loginRoutes = require("./routes/loginRoutes");

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
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(cookieParser());

//Routes
app.use("/api/sessions", loginRoutes);
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
    res.render("login");
})

app.get("/api/home", passport.authenticate("jwt", {session: false}), (req, res)=>{
    res.render("home");
})

app.get("/realTimeProducts", async(req, res)=>{
    try{
        const productos = await productManager.getProducts();
        res.status(200).render("realTimeProducts", {productos});
    } catch(error){
        res.status(500).json({error: error.message});
    }
})

// Ponemos a escuchar el servidor.
server.listen(PORT, ()=> console.log(`Servidor corriendo en localhost:${PORT}`));