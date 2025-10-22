const Category = require("../models/Category");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.body;
    const category = new Category({ name, subcategories });
    await category.save();
    res.status(201).json({ msg: "Category added", category });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, subcategories },
      { new: true }
    );
    if (!category) return res.status(404).json({ msg: "Category not found" });
    res.json({ msg: "Category updated", category });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ msg: "Category not found" });
    res.json({ msg: "Category deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


