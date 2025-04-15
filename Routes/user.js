const express = require('express');
const router = express.Router();
const user = require("../models/user.js");
const WrapAsync = require('../utils/wrapasync.js');
const passport = require('passport');


router.get("/signup" , (req,res) => {
    res.render("User/signup.ejs")
})

router.post("/signup" , WrapAsync( async (req,res) => {
    try {
        const {username,email,password} = req.body;
        const newUser = new user({username,email});
        const registeredUser = await user.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash('success', 'Welcome to ShareBnB!');
            res.redirect("/listings");
        })
    } 
    
    catch (error) {
        req.flash('error', error.message);
        res.redirect("/signup");
    }
   
}))


router.get("/login" , (req,res) => {
    res.render("User/login.ejs")
})


router.post("/login", passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), 
    async (req,res) => {
    req.flash("success" , "Welcome Back!");
    res.redirect("/listings");
})


router.get("/logout", (req,res,next) => {
    req.logout((err) => {
        if(err ){
          return next(err);
        }
        req.flash("success" ,"You Are Logged Out!");
        res.redirect("/listings");
    })
})

module.exports = router;
