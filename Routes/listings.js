const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError.js');
const WrapAsync = require('../utils/wrapasync.js');
const { listingSchema } = require('../schema.js');
const listing = require('../models/listing.js');
const reviews = require('../models/review.js');
const { isLoggedin, isOwner } = require('../middelware.js');
const listingControllers = require("../controllers/listings.js");
const multer = require('multer');
const upload = multer({dest: 'uploads/'})

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
router.get("/", WrapAsync(listingControllers.index));


//NEW Route
router.get("/new" ,
    isLoggedin,
    listingControllers.renderNewForm);


//Show induvidual listing
router.get('/:id', 
    WrapAsync
    (listingControllers.ShowRoute));



//Create Route
router.post('/' , validateListing,
    WrapAsync(listingControllers.CreateRoute));


//Edit Route
    router.get('/:id/edit' ,
         isLoggedin,
            isOwner,
         WrapAsync(listingControllers.EditRoute));

//Update Route
router.put("/:id" , 
    isLoggedin,  
    isOwner,
    validateListing,
    WrapAsync(listingControllers.UpdateRoute));


//Delete Route
router.delete("/:id" , 
    isLoggedin,
    isOwner,
    validateListing,
    WrapAsync(listingControllers.DeleteRoute));


module.exports = router;
