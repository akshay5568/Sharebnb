const listing = require('../models/listing');
const review = require('../models/review.js');

module.exports.CreateReview = async (req,res) => {
    let list = await listing.findById(req.params.id);
    console.log(list);
    let newReview = new review(req.body.review);
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    console.log(newReview);
    req.flash("success", "Reviwe Created Successfully")
    res.redirect(`/listings/${list._id}`)
};

module.exports.DeleteRoute = async (req, res) => {
    let {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await review.findByIdAndDelete(reviewId); 
    req.flash("success", "Reviwe Deleted Successfully")
    res.redirect(`/listings/${id}`);  
};

