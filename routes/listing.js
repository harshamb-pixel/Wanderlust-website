const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require("../Schema.js");
const Listing = require('../models/listing.js'); // import the "Listing" model from the "models/listing.js" file
const flash = require("connect-flash");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");


//Index Route
router.get("/",
    
    wrapAsync(async (req,res) => {
     const allListings=await Listing.find({}); // Retrieve all listings from the database
    res.render("listings/index.ejs", {allListings});
})
);

//new route
router.get("/new", isLoggedIn,(req,res) => {
    res.render("listings/new.ejs");
});

//Show Route
router.get("/:id",
    isLoggedIn,
    wrapAsync(async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author" }
    })
    .populate("owner"); 
    if(!listing){
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
  })
);

//create route
router.post("/",
    isLoggedIn,
    validateListing,
        wrapAsync(async (req,res,next) => {
           const newlisting = new Listing(req.body.listing);
           newlisting.owner = req.user._id;
           await newlisting.save();
           req.flash("success", "New listing created!");
           res.redirect("/listings");
        })
        );

//edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req,res) => {
     let { id } = req.params;
     const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
    }
     res.render("listings/edit.ejs", { listing });
})
);

//update route
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async (req,res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
})
);


//delete route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req,res) => {
    let { id} = req.params;
    let deletedListing =await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("error", "Listing deleted!");
    res.redirect("/listings");
})
);

module.exports = router;