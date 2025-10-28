const passport = require("passport");
const localStrategy = require("passport-local").Strategy
const jwtStrategy = require ("passport-jwt").Strategy
const { ExtractJwt } = require("passport-jwt");
const userModel = require("../models/userModels");
const bcrypt = require("bcrypt");
const SECRET = require("./config");


//Autenticacion Local
passport.use("local", new localStrategy(
    {usernameField: "email"}, async(email, password, done) =>{
        try{
            const user = await userModel.findOne({ email });

            if(!user){
                return done(null, false, {message: "Credenciales incorrectas."});
            }
            const isValid = await bcrypt.compare(password, user.password);

            if(!isValid){
                return done(null, false, {message: "Credenciales incorrectas."});
            }

            return done(null, user);

        } catch(error){
            return done(error)
        }
    }
))

// Autenticacion JWT
passport.use("jwt", new jwtStrategy({jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req?.cookies?.token || null
]), secretOrKey: SECRET }, async (payload, done) => {
    try{
        const email = payload.email;
        const user = await userModel.findOne({ email })
        if(!user) return done(null, false, {message: "Cuenta invalida"});
        return done(null, payload); //No devolver "user" completo con todos los datos, devuelvo solo los datos de la firma.
    } catch(error){
        return done(error, false);
    }
}))

module.exports = passport