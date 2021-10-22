const express = require('express');
require('../config/cloudinary');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const { postListings } = require('../controllers/postlisting')
const upload = require('../services/multerImages');


//post listings route
router.post('/listings/add', verifyToken, upload.array('images', 5), postListings);

module.exports =  router;