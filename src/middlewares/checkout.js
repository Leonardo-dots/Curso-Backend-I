const jwt = require("jsonwebtoken");
const SECRET = require("../config/config");

module.exports = function(req, res, next){
    const token = req?.cookies?.token;

    //Si no tiene token que prosiga.
    if(!token) return next();

    try{
        jwt.verify(token, SECRET); // try/catch porque este metodo pueda lanzar errores si falla.
        return res.redirect("/api/home");
    } catch(error){
        return next();
    }
}
