const express = require('express');
const router = express.Router({mergeParams: true});
const ExpressError = require('../utils/ExpressError.js');
const WrapAsync = require('../utils/wrapasync.js');
const { reviewSchema } = require('../schema.js');
const listing = require('../models/listing.js');
const review = require('../models/review.js');
const { isLoggedin, isOwner , isAouthor} = require('../middelware.js');
const reviewControllers = require('../controllers/reviews.js')

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(el => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else { 
        next();
    }
}

//Reviwes
//Post Reviwes Route

router.post("/" ,
    isLoggedin,
    WrapAsync(reviewControllers.CreateReview))



//Delete Reviews Route
router.delete("/:reviewId" , 
    isLoggedin,
    isAouthor,
    WrapAsync(reviewControllers.DeleteRoute))


module.exports = router;
 

