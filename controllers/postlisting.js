const Post = require('../models/Post');
const Agent = require('../models/Agent');

exports.postListings = async (req, res, next) => {
  const {
    title, address, location, area, category, numberOfBathrooms, numberOfBedrooms, furnishing, condition, price, denomination, facilities, houseRules,
  } = req.body;

  const imagesUrl = [];
  const { files } = req;
  for (const file of files) {
    const { path } = file;
    imagesUrl.push(path);
  }

  try {
    const listing = await new Post({
      title,
      address,
      location,
      area,
      category,
      numberOfBathrooms,
      numberOfBedrooms,
      furnishing,
      condition,
      price,
      denomination,
      facilities,
      houseRules,
      images: imagesUrl,
    });

    const savedListing = await listing.save();
    if (savedListing) {
      const foundAgent = await Agent.findOne({ _id: req.user.id });
      await foundAgent.populate('post_id').execPopulate();
      req.flash('success_msg', 'Listing saved.');
      return res.status(201).render('profiles.ejs');
    }
    return res.status(400).json({ msg: 'Oops.... Something went wrong.' });
  } catch (err) {
    next(err);
  }
};
