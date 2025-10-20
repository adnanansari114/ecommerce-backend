const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  brand: String,
  images: [String],
  price: Number,
  mrp: Number,
  description: String,
  details: String,
  colorOptions: [String],
  sizeOptions: [String],
  rating: Number,
  reviews: Number,
  stock: Number,
  sku: String,
  category: { type: String, required: true },
  subcategory: { type: String },
  featured: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;