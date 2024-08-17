const FashionImg=require("../models/fashion_imgs.js");
const ExpressError=require('../utils/ExpressError.js');
const Comment=require("../models/comments.js");

module.exports.createComment=async (req, res) => {
    try {
      const { id } = req.params;
      const { comment, rating } = req.body;
    
      const fashionImg = await FashionImg.findById(id);
      if (!fashionImg) {
        return res.status(404).json({ message: "Fashion Image not found" });
      }
    
      const newComment = new Comment({ comment, rating, createdAt: new Date() });
      newComment.author=req.user._id;
      console.log(newComment);
      fashionImg.comments.push(newComment);
    
      await newComment.save();
      await fashionImg.save();
      console.log('Updated Fashion Image:', fashionImg);
      res.status(201).json(fashionImg);
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ message: 'Failed to add comment' });
    }
};

module.exports.destroyComment=async(req,res)=>{
    try {
    const {id, commentId}=req.params;
    let comment=await Comment.findById(commentId);
    if(!comment.author._id.equals(req.user._id)){
      return res.status(403).json({message: "You are not the author of this comment."});
    }
    const fashionImg = await FashionImg.findByIdAndUpdate(
    id,
    { $pull: { comments: commentId } },
    { new: true } // This option returns the updated document
    ).populate('comments');
    const deletedComment=await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
    return res.status(404).json({ message: 'Comment not found' });
    }
    console.log(deletedComment);
    res.status(200).json(fashionImg);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};