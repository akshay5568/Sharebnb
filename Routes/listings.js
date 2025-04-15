const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError.js');
const WrapAsync = require('../utils/wrapasync.js');
const { listingSchema } = require('../schema.js');
const listing = require('../models/listing.js');
const reviews = require('../models/review.js');
const { isLoggedin, isOwner } = require('../middelware.js');



const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(el => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else { 
        next();
    }
}


//ALL LISTINGS
router.get("/", WrapAsync(async (req,res) => {
    const AllListings = await listing.find()
    res.render("listings/index" , {AllListings})
}));


//NEW Route
router.get("/new" ,
    isLoggedin,
    (req, res) => {
    res.render("listings/new")
});


//Show induvidual listing
router.get('/:id', 
    WrapAsync
    (async (req,res) => {
    let {id} = req.params;
    const listingData = await listing.findById(id).populate({path:'reviews', populate:{path:'author'}}).populate('owner');
    if(!listingData) {
        req.flash("error", "Listing Not Found")
        return res.redirect("/listings")
    }
    console.log(listing);
    res.render("listings/show", {listingData})
}));



//Create Route
router.post('/' , validateListing,
    WrapAsync(async (req,res,next) => {

    // const {title,description, image,price,location,country} = req.body;
    // let newlisting = {title,description, image,price,location,country} ;
    let newlisting =new listing(req.body.listing);

    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "Listing Created Successfully")
    res.redirect("/listings");
}));


//Edit Route
    router.get('/:id/edit' ,
         isLoggedin,
            isOwner,
         WrapAsync(async (req,res,next) => {
        let {id} = req.params;
        const listingData = await listing.findById(id);
        if(!listingData) {
            req.flash("error", "Listing Not Found")
            return res.redirect("/listings")
        }
       res.render("listings/edit", {listingData})
}));

//Update Route
router.put("/:id" , 
    isLoggedin,  
    isOwner,
    validateListing,
    WrapAsync(async (req,res) => {
    if(!req.body.listing) throw new ExpressError(400, "Invalid Listing Data");
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated Successfully")
    res.redirect(`/listings/${id}`);
}));


//Delete Route
router.delete("/:id" , 
    isLoggedin,
    isOwner,
    validateListing,
    WrapAsync(async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully")
    res.redirect("/listings");
}));



module.exports = router;
