const express = require('express');
const router = express.Router();
const user = require("../models/user.js");
const WrapAsync = require('../utils/wrapasync.js');
const passport = require('passport');
const userControllers = require('../controllers/users.js');

router.get("/signup" , userControllers.renderSignupForm)

router.post("/signup" , WrapAsync(userControllers.signup));


router.get("/login" , userControllers.renderLoginForm);


router.post("/login", passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), 
   userControllers.login)


router.get("/logout", userControllers.logout)

module.exports = router;
