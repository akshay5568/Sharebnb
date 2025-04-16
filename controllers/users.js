module.exports.renderSignupForm = (req,res) => {
    res.render("User/signup.ejs")
};


module.exports.signup = async (req,res) => {
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
   
};

module.exports.renderLoginForm = (req,res) => {
    res.render("User/login.ejs")
};


module.exports.login =  async (req,res) => {
    req.flash("success" , "Welcome Back!");
    res.redirect("/listings");
};

module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err ){
          return next(err);
        }
        req.flash("success" ,"You Are Logged Out!");
        res.redirect("/listings");
    })
};

