require('dotenv').config();
// console.log(process.env);

const express = require("express");
const cors = require("cors");
const app = express();
const mongoose=require('mongoose');
const PORT = process.env.PORT || 4000;
// const MONGO_URL='mongodb://127.0.0.1:27017/fashionDB';
const dbUrl=process.env.ATLASDB;
const FashionImg=require("./models/fashion_imgs.js");
const ExpressError=require('./utils/ExpressError.js');
const Comment=require("./models/comments.js");
const multer  = require('multer')
const {storage}=require('./cloudConfig.js');
const upload = multer({ storage })


const session=require("express-session");
const MongoStore = require("connect-mongo");
const flash=require("connect-flash");
const bodyParser = require('body-parser')
const morgan = require('morgan')
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

app.use(cors({
  origin: 'https://fashion-community-app-frontend.onrender.com',
  credentials: true
}));
app.set("trust proxy",1);
app.use(morgan('dev'))
app.use(
	bodyParser.urlencoded({
		extended: false
	})
)
app.use(bodyParser.json());

const store= MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
      secret: process.env.SECRET,
    },
  touchAfter: 24*3600, 
});
store.on("error",()=>{
 console.log("Error in MONGO SESSION STORE", err);
});

const sessionOptions={
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: Date.now() + 7*24*60*60*1000,
      maxAge: 7*24*60*60*1000,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
  }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
main().then(()=>{
   console.log("connected to db.");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// app.use( (req, res, next) => {
//   console.log('req.session', req.session);
//   return next();
// });

app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
    });
});

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

const listRouter=require("./routes/list.js");
const commentRouter=require("./routes/comment.js");
const userRouter=require("./routes/user.js");
app.use("/list", listRouter);
app.use("/list/:id/comments", commentRouter);
app.use("/", userRouter);

//demouser
app.get("/demouser", async (req,res)=>{
    let fakeuser=new User ({
        email: "student@gmail.com",
        username: "student",
    });
    let registeredUser= await User.register(fakeuser, "helloworld"); //2nd argument is password //pbkdf2 hashing algorithm
    res.send(registeredUser);
});
//test to save data in database
app.get("/test", async (req,res)=>{
    let sample=new FashionImg(
      {
        title: "Preparing for Graduation",
        description: "How do I look?",
        image: {
          url: "https://images.unsplash.com/photo-1506152450634-209d83087969?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
