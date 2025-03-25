const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const listing = require('./models/listing');
const path = require('path');
const req = require('express/lib/request');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const WrapAsync = require('./utils/wrapasync.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const review = require('./models/review');


app.use(express.json());
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);


app.get("/", (req,res) => {
    res.send("Hello World!");
})

main().then(() => {
    console.log("Connected to MongoDB");
})
.catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Sharebnb');
}


// app.get("/listings" , async (req,res) => {
   
//     await listing.insertOne(sampleListings);
//     res.send("listing Succsessfully created");
// })


//ALL LISTINGS
app.get("/listings", WrapAsync(async (req,res) => {
    const AllListings = await listing.find()
    res.render("listings/index" , {AllListings})
}));


//NEW Route
app.get("/listings/new" , (req, res) => {
    res.render("listings/new")
});


//Show induvidual listing
app.get('/listings/:id', WrapAsync(async (req,res) => {
    let {id} = req.params;
    const listingData = await listing.findById(id).populate('reviews');
    res.render("listings/show", {listingData})
}));


const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(el => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else { 
        next();
    }
}

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(el => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else { 
        next();
    }
}

//Create Route
app.post('/listings' , validateListing,
    WrapAsync(async (req,res,next) => {
   
    // const {title,description, image,price,location,country} = req.body;
    // let newlisting = {title,description, image,price,location,country} ;
    let newlisting =new listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
}));


//Edit Route
    app.get('/listings/:id/edit' , WrapAsync(async (req,res,next) => {
        let {id} = req.params;
        const listingData = await listing.findById(id);
       res.render("listings/edit", {listingData})
}));

//Update Route
app.put("/listings/:id" , WrapAsync(async (req,res) => {
    if(!req.body.listing) throw new ExpressError(400, "Invalid Listing Data");
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


//Delete Route
app.delete("/listings/:id" , WrapAsync(async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


//Reviwes
//Post Reviwes Route

app.post("/listings/:id/reviews" , WrapAsync( async (req,res) => {
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
app.delete("/listings/:id/reviews/:reviewId" , WrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await review.findByIdAndDelete(reviewId); 
    res.redirect(`/listings/${id}`);  
}))


 










// App.all is used to catch all the routes that are not defined

app.all("*" , (req,res,next) => {
    next(new ExpressError(404 , "Page Not Found"));
})

app.use((err,req,res,next) => {
    let {statusCode = 500 , message = "Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs", {message})
})



