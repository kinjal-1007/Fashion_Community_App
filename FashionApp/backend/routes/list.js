const express = require("express");
const router=express.Router();
const multer  = require('multer')
const {storage}=require('../cloudConfig.js');
const upload = multer({ storage });
const {isLoggedIn}=require("../middlewares/auth.js");

const listController=require("../controllers/list.js");
//check auth
router.get('/check-auth', isLoggedIn, (req, res) => {
    return res.status(200).json({ authenticated: true });
});

//index
router.get('/', listController.index);
//show
router.get('/:id', listController.showPost);
//new
router.get("/new", listController.renderNew);
//create a new post
router.post('/new', upload.single('image'), listController.createPost);
//edit
router.get('/:id/edit', listController.showPostBeforeEdit);
// Update a single post
router.put('/:id', upload.single('image'), listController.editPost);
//like
router.post("/:id/like", isLoggedIn, listController.likePost);
//delete
router.delete('/:id', isLoggedIn, listController.destroyPost);


module.exports = router;