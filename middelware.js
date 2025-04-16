const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedin = (req,res,next) => {
  if (!req.isAuthenticated()){
    req.flash("error" , "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
}


module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit this listing");
    return res.redirect(`/listings/${id}`);
  }

  next(); 
};



module.exports.isAouthor = async (req, res, next) => {
  let {id , reviewId} = req.params;
  let review = await Review.findById(reviewId).populate('author');
  if (!review || !review.author || !review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/listings/${req.params.id}`);
}

}
