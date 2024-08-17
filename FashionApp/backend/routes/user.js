const express = require("express");
const router=express.Router();
const passport=require("passport");
const {setRedirectUrl}=require("../middlewares/auth.js");
const userController=require("../controllers/user.js");

router.post("/signup", userController.signup);
router.post("/login", setRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: 'Invalid username or password'}), userController.login);

router.post('/logout', userController.logout);

module.exports=router;