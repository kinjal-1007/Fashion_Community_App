const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Comment=require("./comments.js"); // eslint-disable-line no-unused-vars

// const commentSchema = new Schema({
//   comment: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
//   rating: { type: Number, min: 1, max: 5, required: true },
//   author: { type: Schema.Types.ObjectId, ref: 'User' }
// });


const FashionImgSchema=new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    image: {
       url: String,
       filename: String,
    },
    hashtags: [{ type: String }],
    comments: [
      {
          type: Schema.Types.ObjectId,
          ref: 'Comment',
      }
  ],
    likes: { type: Number, default: 0 },
    // likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  });

  FashionImgSchema.post("findOneAndDelete",async(img)=>{
    if(img){
      await Comment.deleteMany({_id: {$in: img.comments}});
    }
  });
module.exports = mongoose.model('FashionImg', FashionImgSchema);
