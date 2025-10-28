const SECRET = require("../config/config");
const UserManager = require("../dao/UserManager");
const { Router } = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const checkout = require("../middlewares/checkout");
const router = Router();

//Ruta de regitro
router.route("/register")
.get( checkout, (req, res) =>{
    res.render("register");
})
.post(async(req, res) => {
    try{
        const {first_name, last_name, email, age, password, confirmPassword} = req.body;
        const user = await UserManager.userRegister(first_name, last_name, email, age, password, confirmPassword);

        //Si accede se realiza la creacion del token
        const TokenUser = jwt.sign({id:user._id, email: user.email, role: user.role}, SECRET, { expiresIn: "1h"})

        //Se guarda en la cookie
        res.cookie("token", TokenUser, {httpOnly: true, maxAge: 3600000})
        
        res.redirect("/api/sessions/current");
    } catch(err){
        res.status(400).json({message: err.message});
    }
})

router.route("/login")
.get(checkout, (req, res)=> {
    res.render("login")
})
.post (passport.authenticate("local", {session: false, failureRedirect: "/api/sessions/login"}),async(req, res) =>{
    try{
        const user = req.user;

        //Si accede se realiza la creacion del token
        const TokenUser = jwt.sign({id:user._id, email: user.email, role: user.role}, SECRET, { expiresIn: "1h"})

        //Se guarda en la cookie
        res.cookie("token", TokenUser, {httpOnly: true, maxAge: 3600000})
        res.status(200).redirect("/api/home");
        
    } catch(err){
        res.status(400).redirect("/api/sessions/login");
    }
})

router.post("/logout", (req, res)=>{
    res.clearCookie("token");
    res.redirect("/api/sessions/login");
})

router.get("/current", passport.authenticate("jwt", {session: false}) , (req, res)=>{
    const user = req.user;
    res.status(200).json({ user });
})



module.exports = router;