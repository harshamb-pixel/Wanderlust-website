const mongoose= require('mongoose');
const initData = require('./data.js');
const Listing = require("../models/listing.js");

const  MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";  // MongoDB connection URL and it creates a collection named "wanderlust" if it doesn't exist

main()
.then((res) =>{
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({}); // Clear existing listings
    initData.data = initData.data.map(obj => ({...obj, owner: "69ac69e0ba3717f0fd8976cb"}));
    await Listing.insertMany(initData.data);
    console.log("Database initialized ");
}

initDB();