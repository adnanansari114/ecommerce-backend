const StaticPage = require('../models/StaticPage');

// Get page by slug (public)
exports.getPage = async (req, res) => {
  try {
    const page = await StaticPage.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ msg: "Page not found" });
    res.json(page);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Admin: create or update page
exports.upsertPage = async (req, res) => {
  try {
    const { slug, title, content } = req.body;
    if (!slug || !title || !content) return res.status(400).json({ msg: "All fields required" });
    const page = await StaticPage.findOneAndUpdate(
      { slug },
      { title, content, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    res.json(page);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};