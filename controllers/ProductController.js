const Product = require('../models/Product');
const Category = require("../models/Category");

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, color, minRating, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (color) filter.colorOptions = color; // Matches if color in array
    if (minRating) filter.rating = { $gte: Number(minRating) };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getUniqueColors = async (req, res) => {
  try {
    const colors = await Product.distinct('colorOptions');
    res.json([...new Set(colors)]); 
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try { 
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    if (req.files && req.files.length > 0) {
      product.images = req.files.map(f => `/uploads/${f.filename}`);
    }
    await product.save();
    res.status(201).json({ msg: "Product added", product });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const update = req.body;
    if (req.files && req.files.length > 0) {
      update.images = req.files.map(f => `/uploads/${f.filename}`);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json({ msg: "Product updated", product });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


