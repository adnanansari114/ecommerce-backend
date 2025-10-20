const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subcategories: [{ type: String }], // simple array of subcategory names
  createdAt: { type: Date, default: Date.now },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
