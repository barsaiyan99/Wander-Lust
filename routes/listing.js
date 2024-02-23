const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js"); 
const validatelisting = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400,errMsg); 
    }else{
        next();
    }
};
router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("index.ejs",{allListings});
}));
router.get("/new",(req,res)=>{
    res.render("new.ejs");
});
router.post("/",validatelisting,wrapAsync( async(req,res,next)=>{
     const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success","new listing created!");
      res.redirect("/listings");   
  
}));
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("edit.ejs",{listing});
}));
router.put("/:id",validatelisting,wrapAsync(async(req,res)=>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
}));
router.get("/:id",wrapAsync(async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("show.ejs",{listing});
}));
router.delete("/:id",wrapAsync( async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
  }));
  module.exports = router;