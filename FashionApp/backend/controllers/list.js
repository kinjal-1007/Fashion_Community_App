const FashionImg=require("../models/fashion_imgs.js");
const ExpressError=require('../utils/ExpressError.js');
const Comment=require("../models/comments.js");

module.exports.index= async (req, res) => {
    try {
      const result = await FashionImg.find({});
      res.json(result); 
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

module.exports.showPost=async (req, res) => {
    try {
      const fashionImg = await FashionImg.findById(req.params.id).populate({
        path: 'comments',
        populate: { path: 'author' }  
      }).populate('owner');
      if (!fashionImg) {
        return res.status(404).json({ message: 'Fashion image not found' });
      }
      const currUserId = req.user ? req.user._id : null;
      console.log(currUserId);
      res.json({fashionImg,currUserId});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports.renderNew=(req,res)=>{
    res.send("Your new form");
};

module.exports.createPost=async (req, res) => {
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
    console.log(req.user);
    newFashionImg.owner=req.user._id;
    await newFashionImg.save();
    req.flash("success","New Post created!");
    res.status(201).json(({
      fashionImg: newFashionImg,
      success: req.flash("success"),
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.showPostBeforeEdit=async (req, res) => {
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
};

module.exports.editPost=async (req, res) => {
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
      res.json({fashionImg, message: "Post edited successfully!"});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
module.exports.likePost=async (req, res) => {
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
};

module.exports.destroyPost=async (req, res) => {
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
  };