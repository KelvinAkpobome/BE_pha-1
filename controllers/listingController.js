/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const { ObjectID } = require('mongodb');
const { db } = require('../config/db');
const { successResMsg, errorResMsg } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger');

exports.postListings = catchAsync(async (req, res, next) => {
  const { validatedListings } = req;
  try {
    if (!req.files) return errorResMsg(res, 403, 'Please attach the images');
    const imagesUrl = [];
    const { files } = req;
    for (const file of files) {
      const { path } = file;
      imagesUrl.push(path);
    }
    validatedListings.images = imagesUrl;
    validatedListings.agents_email = req.user.email;
    validatedListings.createdAt = new Date();

    const savedListing = await db.collection('listings').insertOne(validatedListings);

    if (savedListing) {
      return successResMsg(res, 201, savedListing.data);
    }
    return errorResMsg(res, 403, 'Oops.....Something went wrong');
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
});

exports.getAllListing = catchAsync(async (req, res, next) => {
  try {
    logger.info('Started all listings ');
    const foundListings = await db.collection('listings').find({}).project({ _id: 0, createdAt: 0, listingId: 0 }).sort({ createdAt: 1 })
      .toArray();
    return successResMsg(res, 200, foundListings);
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
});

exports.searchListingsByCatType = catchAsync(async (req, res, next) => {
  if (!req.query.category || !req.query.type) {
    logger.error('Please enter search details');
    return errorResMsg(res, 404, 'Please enter search details');
  }
  const { category, type } = req.query;
  try {
    logger.info('Started all listings by category and type');
    const foundListings = await db.collection('listings').find({ category, $text: { $search: type } }).sort({ price: 1 }).toArray();
    return successResMsg(res, 200, foundListings);
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
});

exports.sortListingByCreationDate = catchAsync(async (req, res, next) => {
  try {
    logger.info('Started all listings by creation date');
    const foundListings = await db.collection('listings').find({}).sort({ createdAt: 1 }).toArray();
    return successResMsg(res, 200, foundListings);
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
});

exports.sortListingByPrice = catchAsync(async (req, res, next) => {
  try {
    logger.info('Started all listings by price');
    const foundListings = await db.collection('listings').find({}).sort({ Price: 1 }).toArray();
    return successResMsg(res, 200, foundListings);
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
});

exports.sortListingByCategory = catchAsync(async (req, res, next) => {
  if (!req.query.category) {
    logger.error('Please enter query details');
    return errorResMsg(res, 404, 'Please enter query details');
  }
  const categoryFromDb = req.query.category;
  try {
    logger.info('Started all listings by category');
    const foundListings = await db.collection('listings').find({ category: categoryFromDb }).project({ _id: 0, createdAt: 0, listingId: 0 }).sort({ price: 1 })
      .toArray();
    // console.log(foundListings)
    return successResMsg(res, 200, foundListings);
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
});

exports.bookListingForInspection = catchAsync(async (req, res, next) => {
  const { listingId } = req.params;
  const userEmail = req.user.email;
  try {
    logger.info(`Started search for listing with id: ${listingId} `);
    const foundListing = await db.collection('bookings').find({ userEmail, listingIds: listingId }).toArray();
    if (foundListing.length === 0) {
      await db.collection('bookings').findOneAndUpdate({ userEmail },
        {
          $set: { userEmail },
          $addToSet: { listingIds: listingId },
          $currentDate: {
            updatedAt: true,
            createdAt: true,
          },
        }, { upsert: true });
      logger.info('Listing booked for inspection');
      return successResMsg(res, 200, 'Listing booked for inspection');
    } if (foundListing.length > 0 && foundListing[0].listingIds.length >= 5) {
      logger.error('Sorry, you cannot book more than 5 listing for 0ne inspection');
      return errorResMsg(res, 400, 'Sorry, you cannot book more than 5 listing for 0ne inspection');
    }

    // console.log(foundListing.listingIds.length)
    logger.error('Listing already booked for inspection');
    return errorResMsg(res, 400, 'Listing already booked for inspection');
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  if (!req.params.bookingId) return errorResMsg(res, 400, 'Please supply booking ID');
  const { bookingId } = req.params;
  try {
    logger.info(`Started search for Booking with id: ${bookingId} `);
    const foundbooking = await db.collection('bookings').find({ _id: ObjectID(bookingId) }).toArray();
    console.log(foundbooking);
    if (foundbooking.length === 0) {
      logger.error('Booking not found');
      return errorResMsg(res, 404, 'Booking not found');
    }
    await db.collection('bookings').deleteOne({ _id: ObjectID(bookingId) });
    logger.info('Booking deleted');
    return successResMsg(res, 200, 'Booking deleted');
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
});
exports.deleteOneListingFromBooking = catchAsync(async (req, res, next) => {
  const { listingId } = req.params;
  const userEmail = req.user.email;
  try {
    logger.info(`Started search for listing with id: ${listingId} `);
    const result = await db.collection('bookings').findOneAndUpdate({ userEmail, listingIds: listingId },
      {
        $set: { userEmail },
        $pull: { listingIds: listingId },
        $currentDate: {
          updatedAt: true,
        },
      });
    if (result.value === null) {
      logger.error('This listing is not part of your booking');
      return errorResMsg(res, 400, 'This listing is not part of your booking');
    }
    logger.info('Listing reomved from booking');
    return successResMsg(res, 200, 'Listing removed from booking');
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
});
