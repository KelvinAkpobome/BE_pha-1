const { decodeToken } = require('../services/jwtService');

exports.verifyToken = async (req, res, next) => {
  const token = req.cookies.jwt || '';
  try {
    if (!token) {
      req.flash('error_msg', 'You are not logged in');
      return res.redirect('/');
    }
    const decoded = await decodeToken(token);
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    next();
  } catch (err) {
    return next(err);
  }
};
