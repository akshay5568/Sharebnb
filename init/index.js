const mongoose = require('mongoose');
const initdata = require('./data.js');
const listing = require('../models/listing.js');


main().then(() => {
    console.log("Connected to MongoDB");
})
.catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Sharebnb');
}


const initDB = async () => {
    await listing.deleteMany({})
    initdata.data =  initdata.data.map((obj) => ({...obj, owner:"67fcb8fb2c08ad6d19919cb6"}))
    await listing.insertMany(initdata.data);
    console.log("Database initialized");
}

initDB();
