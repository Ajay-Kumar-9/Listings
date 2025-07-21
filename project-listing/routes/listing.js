const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedin,
    
    upload.single("listing[image]"),
    validateListing,
    
    wrapAsync(listingController.createListing),
  );






 

//NEW ROUTE (render a form to create new lisitng)
router.get("/new", isLoggedin, listingController.renderNewForm);



router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedin,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedin, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;




router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(listingController.editListing)
);


module.exports = router;
