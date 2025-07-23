const Listing = require('../models/listing.js');

module.exports = async (req, res, next) => {
  const searchQuery = req.query.query;  // Fetch search query from URL

  if (!searchQuery) {
    // If no search query, show all listings
    try {
      const allListings = await Listing.find();  // Fetch all listings
      return res.render('listings/index', { allListing: allListings });  // Render index.ejs with all listings
    } catch (err) {
      console.error('Error fetching listings:', err);
      return next(new Error('Something went wrong while fetching listings.'));
    }
  }

  try {
    // Sanitize the search query to escape special regex characters
    const sanitizedQuery = searchQuery.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");

    // Search listings in DB by title, location, and country (case insensitive)
    const listings = await Listing.find({
      $or: [
        { title: { $regex: sanitizedQuery, $options: 'i' } },
        { location: { $regex: sanitizedQuery, $options: 'i' } },
        { country: { $regex: sanitizedQuery, $options: 'i' } }
      ]
    });

    // Render the search results page with the listings and the search query
    return res.render('listings/searchResults', { listings, query: searchQuery });

  } catch (err) {
    console.error(`Error during search query: ${searchQuery}`, err);
    return next(new Error('Something went wrong while searching.'));
  }
};
