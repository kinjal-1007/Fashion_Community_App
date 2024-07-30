require('dotenv').config();
// console.log(process.env);

const express = require("express");
const cors = require("cors");
const app = express();
const mongoose=require('mongoose');
const PORT = 4000;
const MONGO_URL='mongodb://127.0.0.1:27017/fashionDB';
const FashionImg=require("./models/fashion_imgs.js");
const ExpressError=require('./utils/ExpressError.js');
const Comment=require("./models/comments.js");
const multer  = require('multer')
const {storage}=require('./cloudConfig.js');
const upload = multer({ storage })

main().then(()=>{
   console.log("connected to db.");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
    });
});
//index
app.get('/test1', async (req, res) => {
    try {
      const result = await FashionImg.find({});
      res.json(result); 
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
//show
app.get('/list/:id', async (req, res) => {
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
app.get("/list/new", (req,res)=>{
  res.send("Your new form");
})
//create a new post
app.post('/list/new', upload.single('image'), async (req, res) => {
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
    res.status(201).json(newFashionImg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// app.post('/list/new', upload.single('image'), (req, res) => {
//   console.log(req.body);
//   console.log(req.file);

//   // Handle your logic for saving the new image data here

//   res.json({ message: 'Image uploaded successfully' });
// });
//like
app.post("/list/:id/like", async (req, res) => {
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
// app.post("/list/new", upload.single('image'), (req, res) => {
//   console.log(req.body);
//   console.log(req.file);
// });
//delete
app.delete('/list/:id', async (req, res) => {
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

//comments
app.post("/list/:id/comments", async (req, res) => {
try {
  const { id } = req.params;
  const { comment, rating } = req.body;

  const fashionImg = await FashionImg.findById(id);
  if (!fashionImg) {
    return res.status(404).json({ message: "Fashion Image not found" });
  }

  const newComment = new Comment({ comment, rating, createdAt: new Date() });
  fashionImg.comments.push(newComment);

  await newComment.save();
  await fashionImg.save();

  res.status(201).json(fashionImg);
} catch (error) {
  console.error('Error adding comment:', error);
  res.status(500).json({ message: 'Failed to add comment' });
}
});

//test to save data in database
app.get("/test", async (req,res)=>{
    let sample=new FashionImg(
      {
        title: "Proud to be GenZ",
        description: "I am my own hero.",
        image: {
          url: "https://images.unsplash.com/flagged/photo-1571825142360-17579dba01a9?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          filename: "design1",
        },
        hashtags: ["#coolsummer","#fashion"]
      }
    );
    await sample.save();
    console.log("response saved");
    res.send("successful");
});
app.all("*", (req,res,next)=>{
  next(new ExpressError(404, "Page not found!"));
});
app.use((err,req,res,next)=>{
  let {statusCode=500, message="something went wrong"}= err;
  res.status(statusCode).json({message});
});
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
