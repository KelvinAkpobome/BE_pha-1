const express = require('express');
require('../config/cloudinary');

const router = express.Router();
const { verifyToken, checkIfAgent, checkIfClient } = require('../middlewares/authentication');
const { validateListings } = require('../services/validateListings');
const listings = require('../controllers/listingController');
const upload = require('../services/multerImages');

// post listings route
router.post('/listings/add', verifyToken, checkIfAgent, validateListings, upload.array('images', 5), listings.postListings);
router.get('/listings/all', listings.getAllListing);
router.post('/bookings/add/:listingId', verifyToken, checkIfClient, listings.bookListingForInspection);
router.delete('/listings/rm/:listingId', verifyToken, checkIfClient, listings.deleteOneListingFromBooking);
router.delete('/bookings/rm/:bookingId', verifyToken, checkIfClient, listings.deleteBooking);
router.get('/listings/results/cat', listings.sortListingByCategory);
router.get('/listings/results/date', listings.sortListingByCreationDate);
router.get('/listings/results/price', listings.sortListingByPrice);
router.get('/listings/results/all', listings.searchListingsByCatType);

module.exports = router;
