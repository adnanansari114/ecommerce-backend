const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try { 
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Add product (admin only)
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

// Update product (admin only)
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

// Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};