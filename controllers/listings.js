const listing = require("../models/listing");

module.exports.index =  async (req,res) => {
    const AllListings = await listing.find()
    res.render("listings/index" , {AllListings})
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new")
};

module.exports.ShowRoute = async (req,res) => {
    let {id} = req.params;
    const listingData = await listing.findById(id).populate({path:'reviews', populate:{path:'author'}}).populate('owner');
    if(!listingData) {
        req.flash("error", "Listing Not Found")
        return res.redirect("/listings")
    }
    console.log(listing);
 res.render("listings/show", {listingData})
};

module.exports.CreateRoute = async (req,res,next) => {

    // const {title,description, image,price,location,country} = req.body;
    // let newlisting = {title,description, image,price,location,country} ;
    let newlisting =new listing(req.body.listing);

    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "Listing Created Successfully")
    res.redirect("/listings");
};


module.exports.EditRoute = async (req,res,next) => {
        let {id} = req.params;
        const listingData = await listing.findById(id);
        if(!listingData) {
            req.flash("error", "Listing Not Found")
            return res.redirect("/listings")
        }
       res.render("listings/edit", {listingData})
};

module.exports.UpdateRoute = async (req,res) => {
    if(!req.body.listing) throw new ExpressError(400, "Invalid Listing Data");
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated Successfully")
    res.redirect(`/listings/${id}`);
};


module.exports.DeleteRoute = async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully")
    res.redirect("/listings");
};

