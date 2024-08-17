const User=require("../models/user.js");

module.exports.signup=async (req,res)=>{
    try{
        let {username, email, password}= req.body;
        req.session.username=req.body.username;
        const newUser=new User({username, email});
        const registeredUser=await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                next(err);
            }
            const successMessage = "Welcome!";
            res.json({ message: successMessage, redirectUrl: "/list" });
        })
    } catch(e) {
        // req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.login=(req,res)=>{
    req.flash("success","Welcome back, You are logged in!");
    let redirectUrl= res.locals.redirectUrl || "/list";
    res.json({
        success: req.flash('success'),
        redirectUrl
      });
};

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You are logged out now!');
        res.json({ success: true, message: 'You are logged out now!', redirectUrl: '/list' });
    });
};