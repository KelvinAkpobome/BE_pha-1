const { listingsSchema } = require('../schemas');
const { errorResMsg } = require('../utils/response');
const logger = require('../utils/logger');

exports.validateListings = async (req, res, next) => {
  try {
    logger.info('Validating the req.body');
    const validatedListings = await listingsSchema.validateAsync(req.body);
    if (!validatedListings) return next(err);
    console.log(validatedListings);
    req.validatedListings = validatedListings;
    return next();
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
};
