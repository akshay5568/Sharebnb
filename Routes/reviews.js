const express = require('express');
const router = express.Router({mergeParams: true});
const ExpressError = require('../utils/ExpressError.js');
const WrapAsync = require('../utils/wrapasync.js');
const { reviewSchema } = require('../schema.js');
const listing = require('../models/listing.js');
const review = require('../models/review.js');



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

router.post("/" , WrapAsync( async (req,res) => {
    let list = await listing.findById(req.params.id);
    console.log(list);
    let newReview = new review(req.body.review);
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    console.log(newReview);
    res.redirect(`/listings/${list._id}`)
}))



//Delete Reviews Route
router.delete("/:reviewId" , WrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await review.findByIdAndDelete(reviewId); 
    res.redirect(`/listings/${id}`);  
}))


module.exports = router;
 

