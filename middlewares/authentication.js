const { errorResMsg } = require('../utils/response');
const { verifyJWT } = require('../utils/auth-token');
const logger = require('../utils/logger');

exports.verifyToken = async (req, res, next) => {
  const token = req.header('x-auth-token') || false;
  try {
    if (token) {
      const decoded = await verifyJWT(token);
      if (decoded.email) {
        req.user = {
          email: decoded.email,
          role: decoded.role,
        };
        return next();
      }
      const reason = decoded.message.split(' ')[2];
      if (reason === 'expired') return errorResMsg(res, 401, 'Session has expired, login again');
    }

    return errorResMsg(res, 403, 'You are not logged in');
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
};

exports.checkIfAgent = (req, res, next) => {
  if (req.user.role === 'client') return errorResMsg(res, 403, 'This route is restricted to agent users');
  return next();
};

exports.checkIfClient = (req, res, next) => {
  if (req.user.role === 'agent') return errorResMsg(res, 403, 'This route is restricted to client users');
  return next();
};

exports.checkIfAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return errorResMsg(res, 403, 'This route is restricted to admin users');
  return next();
};
