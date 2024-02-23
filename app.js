const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);
main().then(()=>{
    console.log("connected Successfully!");
}).catch(err=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
const sessionOptions = {
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*100,
    httpOnly: true,
  }
};
app.get("/",(req,res)=>{
    res.send("working");
});
app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
});
// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username: "delta-student",
//   });
//   let registeredUser = await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// })
app.use("/listings",listingRouter);
//reviews
app.use("/listings/:id/reviews",reviewRouter);

  app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
  });
  app.use((err,req,res,next)=>{
    let{statusCode=500,message="Some error occured"} = err;
    res.status(statusCode).render("error.ejs",{message});
  });
app.listen(8080,()=>{
    console.log("App is listening at port 8080");
});