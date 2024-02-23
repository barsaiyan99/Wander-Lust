const express = require('express');
const app = express();
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const user = require("./routes/user.js");
const post = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const sessionOption = {
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,  
}
app.use(session(sessionOption));
app.use(flash());
app.get("/register",(req,res)=>{
    let{name = "anonymous"} = req.query;
    req.session.name = name;
    req.flash("success","user registered successfully");
    res.redirect("/hello");
});
app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name,msg:req.flash("success")});
});
app.listen(3000,()=>{
    console.log("app is listening at port 3030");
});
