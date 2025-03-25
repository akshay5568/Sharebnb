const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError.js');
const WrapAsync = require('../utils/wrapasync.js');
const { listingSchema } = require('../schema.js');
const listing = require('../models/listing.js');
const review = require('../models/review.js');



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
router.get("/new" , (req, res) => {
    res.render("listings/new")
});


//Show induvidual listing
router.get('/:id', WrapAsync(async (req,res) => {
    let {id} = req.params;
    const listingData = await listing.findById(id).populate('reviews');
    res.render("listings/show", {listingData})
}));



//Create Route
router.post('/' , validateListing,
    WrapAsync(async (req,res,next) => {
   
    // const {title,description, image,price,location,country} = req.body;
    // let newlisting = {title,description, image,price,location,country} ;
    let newlisting =new listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
}));


//Edit Route
    router.get('/:id/edit' , WrapAsync(async (req,res,next) => {
        let {id} = req.params;
        const listingData = await listing.findById(id);
       res.render("listings/edit", {listingData})
}));

//Update Route
router.put("/:id" , WrapAsync(async (req,res) => {
    if(!req.body.listing) throw new ExpressError(400, "Invalid Listing Data");
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


//Delete Route
router.delete("/:id" , WrapAsync(async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));



module.exports = router;
