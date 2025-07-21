const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const allListing = require("./data.js");

const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN; // Ensure this is set properly
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

// Ensure that the environment variable is set correctly
const dbUrl = process.env.ATLASDB_URL;
if (!dbUrl) {
  console.error("Error: ATLASDB_URL is not set");
  process.exit(1);
}

main()
  .then(() => {
    console.log("Connection successful with DB");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Listings deleted");

    for (let listing of allListing) {
      try {
        let response = await geocodingClient
          .forwardGeocode({
            query: listing.location,
            limit: 1,
          })
          .send();

        listing.geometry = response.body.features[0].geometry;
      } catch (geoError) {
        console.error("Geocoding error for listing:", listing, geoError);
      }
    }

    const updatedData = allListing.map((obj) => ({
      ...obj,
      owner: "66740214d208973a010e3232",
    }));

    await Listing.insertMany(updatedData);
    console.log("Data was initialized");
  } catch (dbError) {
    console.error("Error initializing data:", dbError);
  }
};

// initDB();