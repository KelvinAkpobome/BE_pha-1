const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Title is required'],
  },
  address: {
    type: String,
    trim: true,
    required: [true, 'Address is required'],
  },
  location: {
    type: String,
    trim: true,
    required: [true, 'Location is required'],
  },
  area: {
    type: String,
    trim: true,
    required: [true, 'Area is required'],
  },
  category: {
    type: String,
    trim: true,
    required: [true, 'Category is required'],
  },
  numberOfBathrooms: {
    type: Number,
    trim: true,
    required: [true, 'Number of bathrooms is required'],
  },
  numberOfBedrooms: {
    type: Number,
    trim: true,
    required: [true, 'Number of bedrooms is required'],
  },
  furnishing: {
    type: String,
    trim: true,
    required: [true, 'Furnishing is required'],
  },
  condition: {
    type: String,
    trim: true,
    required: [true, 'Condition is required'],
  },
  price: {
    type: Number,
    trim: true,
    required: [true, 'Price is required'],
  },
  denomination: {
    type: String,
    trim: true,
    default: null,
  },
  facilities: {
    type: Array,
    default: null,
  },
  houseRules: {
    type: Array,
    default: null,
  },
  images: [{
    type: String,
    required: [true, 'images are required'],
  }],
  video: {
    type: String,
  },
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
