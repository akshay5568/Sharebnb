const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const path = require('path');
const req = require('express/lib/request');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const listings = require("./Routes/listings.js");
const reviews = require("./Routes/reviews.js");



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



app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);




// App.all is used to catch all the routes that are not defined

app.all("*" , (req,res,next) => {
    next(new ExpressError(404 , "Page Not Found"));
})

app.use((err,req,res,next) => {
    let {statusCode = 500 , message = "Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs", {message})
})



