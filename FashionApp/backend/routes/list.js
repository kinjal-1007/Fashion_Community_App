const express = require("express");
const router=express.Router();
const FashionImg=require("../models/fashion_imgs.js");
const ExpressError=require('../utils/ExpressError.js');
const Comment=require("../models/comments.js");
const multer  = require('multer')
const {storage}=require('../cloudConfig.js');
const upload = multer({ storage })
//check auth
// router.get('/check-auth', (req, res) => {
//   if (req.isAuthenticated()) {
//     return res.status(200).json({ authenticated: true });
//   } else {
//     return res.status(401).json({ authenticated: false });
//   }
// });

//index
router.get('/', async (req, res) => {
    try {
      const result = await FashionImg.find({});
      res.json(result); 
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
//show
router.get('/:id', async (req, res) => {
  try {
    const fashionImg = await FashionImg.findById(req.params.id).populate('comments');;
    if (!fashionImg) {
      return res.status(404).json({ message: 'Fashion image not found' });
    }
    res.json(fashionImg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//new
router.get("/new", (req,res)=>{
  res.send("Your new form");
});
//create a new post
router.post('/new', upload.single('image'), async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url);
    console.log(filename);
  try {
    const { title, description, hashtags } = req.body;
    if(!title){
      throw new ExpressError(400, "Title missing");
    }
    if(!description){
      throw new ExpressError(400, "Description missing");
    }
    const newFashionImg = new FashionImg({
      title,
      description,
      hashtags: hashtags ? hashtags.split(',').map(tag => tag.trim()) : [], 
    });
    newFashionImg.image={url, filename};
    await newFashionImg.save();
    req.flash("success","New Post created!");
    res.status(201).json(({
      fashionImg: newFashionImg,
      success: req.flash("success"),
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//edit
router.get('/:id/edit', async (req, res) => {
    const { id } = req.params;
    try {
      const fashionImg = await FashionImg.findById(id);
      if (!fashionImg) {
        throw new ExpressError(400, "Image not found!");
      }
      
      res.json({
        title: fashionImg.title,
        description: fashionImg.description,
        hashtags: fashionImg.hashtags,
        imageUrl: fashionImg.image.url,
        imageFilename: fashionImg.image.filename,
        success: "Updated successfully!"
      });
    } catch (error) {
      console.error('Error fetching fashion image:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
// Update a single post
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, hashtags } = req.body;
      const fashionImg = await FashionImg.findById(id);
  
      if (!fashionImg) {
        throw new ExpressError(400, "Image not found");
      }
  
      fashionImg.title = title || fashionImg.title;
      fashionImg.description = description || fashionImg.description;
      fashionImg.hashtags = hashtags ? hashtags.split(',').map(tag => tag.trim()) : fashionImg.hashtags;
  
      if (req.file) {
        fashionImg.image.url = req.file.path;
        fashionImg.image.filename = req.file.filename;
      }
  
      await fashionImg.save();
      res.json(fashionImg);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
//like
router.post("/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      const fashionImg = await FashionImg.findById(id);
  
      if (!fashionImg) {
        return res.status(404).json({ error: 'Image not found' });
      }
  
      fashionImg.likes += 1;
      await fashionImg.save();
  
      res.json(fashionImg);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
//delete
router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedImage = await FashionImg.findByIdAndDelete(id);
     
      if (!deletedImage) {
        return res.status(404).json({ message: 'Image not found' });
      }
      console.log(deletedImage);
      res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


module.exports = router;