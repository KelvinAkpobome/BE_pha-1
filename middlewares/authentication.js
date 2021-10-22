const log = console.log;
const Agent = require("../models/Agent");
const Client = require("../models/Client");
const { decodeToken } = require('../services/jwtService');
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

exports.verifyToken =  async (req, res, next) => {
  const token = req.cookies.jwt || "";
  try{
    if (!token) {
      req.flash("error_msg", "You are not logged in");
      return res.redirect('/');
    }
    const decoded = await decodeToken(token)
    
    req.user ={
      id: decoded.id,
      email: decoded.email
    }
    next();
  } catch (err){
    return next(err);
  }
   
};

exports.checkUser = async(req, res, next)=> {
  const token = req.cookies.jwt || "";
  if (!token) {
    res.locals.user = null;
    //return res.redirect('/login');
    return next();
  }
  else {
    const decodedToken = decodeToken(token);
    const user = await Agent.findById(decodedToken.id) || await Client.findById(decodedToken.id);
    res.locals.user = user;
    //log(user);
    return next();
  }
  //next();
}

exports.checkIfAgent = function(req, res, next) {
  if (req.user.role !== 'Agent') return res.status(401).json({message: 'This route is restricted to real estate agent users'});
  return next();
}

//exports.checkIfClient = function(req, res, next) {
//  if (req.user.role !== 'Client') return res.status(401).json({message: 'This route is restricted to client users'});
//  return next();
//}
