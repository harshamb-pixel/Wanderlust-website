const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require("../Schema.js");
const Listing = require('../models/listing.js'); // import the "Listing" model from the "models/listing.js" file
const flash = require("connect-flash");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


const listingController = require("../controllers/listings.js");

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/" )
    .get(wrapAsync( listingController.index ) ) //index route
    .post(                                      //create route
    isLoggedIn,
    
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);




router
    .route("/:id") //Show Route
    .get(
    isLoggedIn,
    wrapAsync(listingController.showListing))

    .put(  //update route
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
)

.delete(  //delete route
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
);



//edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);



module.exports = router;