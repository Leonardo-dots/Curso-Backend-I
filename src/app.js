const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const {engine} = require("express-handlebars");

//conexion a MongoDB Atlas
(async ()=>{
    try{
        //servidor a la escucha
        const app = express();
        const PORT = 8080;
        app.listen(PORT, ()=> console.log(`Servidor corriendo en localhost:${PORT}`))

        await mongoose.connect("mongodb+srv://Leonardo:CoderHouse@cluster.4t8msl5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster");
        console.log("Conectado correctamente a MongoDB");
    } catch(error) {
        console.log(error.message);
        process.exit(1);
    }
})();

//Middlewares
app.use(express.json());

//Config handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) =>{
    res.render("home")
})