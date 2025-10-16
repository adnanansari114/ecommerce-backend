const mongoose = require('mongoose');

const staticPageSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true }, // e.g. 'privacy-policy'
  title: { type: String, required: true },
  content: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StaticPage', staticPageSchema);