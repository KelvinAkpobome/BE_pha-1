const { ObjectID } = require('mongodb');
const { db } = require('../config/db');
const { successResMsg, errorResMsg } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger');
const { scheduledInspectionsSchema } = require('../schemas');

exports.scheduleInspection = catchAsync(async (req, res, next) => {
  if (!req.params.bookingId) return errorResMsg(res, 400, 'Please supply booking ID');
  const { bookingId } = req.params;
  const userEmail = req.user.email;
  const scheduleTime = req.body.time;
  try {
    logger.info(`Started search for booking with id: ${bookingId} `);
    console.log(req.body);
    const result = await scheduledInspectionsSchema.validateAsync(req.body);
    console.log(result);
    const foundbooking = await db.collection('scheduledInspections').findOne({ bookingId });
    if (foundbooking) {
      logger.error(`Scheduled inspection already exist for this booking by ${foundbooking.time}`);
      return errorResMsg(res, 400, `Scheduled inspection already exist for this booking by ${foundbooking.time}`);
    }
    await db.collection('scheduledInspections').updateOne({ userEmail }, {
      $set: { userEmail, time: scheduleTime, bookingId },
      $currentDate: {
        updatedAt: true,
        createdAt: true,
      },
    }, { upsert: true });
    logger.info(`Inspection scheduled for ${scheduleTime}`);
    return successResMsg(res, 200, `Inspection scheduled for ${scheduleTime}`);
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
});

exports.rescheduleInspection = catchAsync(async (req, res, next) => {
  if (!req.params.inspectionId) return errorResMsg(res, 400, 'Please supply booking ID');
  const { inspectionId } = req.params;
  const userEmail = req.user.email;
  const scheduleTime = req.body.time;
  try {
    logger.info(`Started search for booking with id: ${inspectionId} `);
    await scheduledInspectionsSchema.validateAsync(req.body);
    const foundbooking = await db.collection('scheduledInspections').findOne({ _id: ObjectID(inspectionId), userEmail });
    if (!foundbooking) {
      logger.error('Scheduled inspection does not exist for this booking');
      return errorResMsg(res, 400, 'Scheduled inspection does not exist for this booking');
    }
    await db.collection('scheduledInspections').updateOne({ _id: ObjectID(inspectionId) }, {
      $set: { time: scheduleTime },
      $currentDate: {
        updatedAt: true,
      },
    });
    logger.info(`Inspection rescheduled for ${scheduleTime}`);
    return successResMsg(res, 200, `Inspection rescheduled for ${scheduleTime}`);
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
});

exports.cancelInspection = catchAsync(async (req, res, next) => {
  if (!req.params.inspectionId) return errorResMsg(res, 400, 'Please supply Inspection ID');
  const { inspectionId } = req.params;
  const userEmail = req.user.email;
  try {
    logger.info(`Started search for inspection with id: ${inspectionId} `);
    const foundbooking = await db.collection('scheduledInspections').findOne({ _id: ObjectID(inspectionId) });
    if (!foundbooking) {
      logger.error('Scheduled inspection not found');
      return errorResMsg(res, 404, 'Scheduled inspection not found');
    }
    if (foundbooking.userEmail !== userEmail) return errorResMsg(res, 404, 'Scheduled inspection not found ');
    await db.collection('scheduledInspections').deleteOne({ _id: ObjectID(inspectionId) });
    logger.info('Inspection deleted');
    return successResMsg(res, 200, 'Inspection deleted');
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
});
