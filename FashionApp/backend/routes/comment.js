const express = require("express");
const router=express.Router({mergeParams: true});
const {isLoggedIn}=require("../middlewares/auth.js");
const commentController=require("../controllers/comment.js");
//comments
router.post("/", isLoggedIn, commentController.createComment);
//delete comment
router.delete("/:commentId", isLoggedIn, commentController.destroyComment);

module.exports= router;