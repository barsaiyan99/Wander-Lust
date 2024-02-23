const express = require('express');
const router = express.Router();
router.get("/",(req,res)=>{
    res.send("get for post");
});
router.get("/:id",(req,res)=>{
    res.send("get for show post ");
});
router.post("/",(req,res)=>{
    res.send("post for posts");
});
router.delete("/post/:id",(req,res)=>{
    res.send("delete");
});
module.exports = router;