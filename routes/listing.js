const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require("../Schema.js");
const Listing = require('../models/listing.js'); // import the "Listing" model from the "models/listing.js" file
const flash = require("connect-flash");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

//Index Route
router.get("/", 
    wrapAsync( listingController.index ) );

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route
router.get("/:id",
    isLoggedIn,
    wrapAsync(listingController.showListing)
);

//create route
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
);

//edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

//update route
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
);


//delete route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
);

module.exports = router;