const express = require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");

router.post("/signup", async (req,res)=>{
    try{
        let {username, email, password}= req.body;
        req.session.username=req.body.username;
        const newUser=new User({username, email});
        const registeredUser=await User.register(newUser, password);
        console.log(registeredUser);
        // req.login(registeredUser, (err)=>{
        //     if(err){
        //         next(err);
        //     }
        //     req.flash("success", "Welcome!");
            res.redirect("/list");
        // })
    } catch(e) {
        // req.flash("error", e.message);
        res.redirect("/signup");
    }
});
router.post("/login", passport.authenticate("local", {failureRedirect: '/login', failureFlash: 'Invalid username or password'}), (req,res)=>{
        req.flash("success","Welcome back, You are logged in!");
        let redirectUrl= res.locals.redirectUrl || "/list";
        delete req.session.redirectTo;
        res.json({
            success: req.flash('success'),
            redirectUrl
          });
});

module.exports=router;