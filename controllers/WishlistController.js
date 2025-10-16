const Wishlist = require('../models/Wishlist');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('items');
  res.json(wishlist || { user: req.user.id, items: [] });
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) wishlist = new Wishlist({ user: req.user.id, items: [] });
  if (!wishlist.items.includes(productId)) wishlist.items.push(productId);
  await wishlist.save();
  res.json(wishlist);
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  const { itemId } = req.params;
  const wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) return res.status(404).json({ msg: "Wishlist not found" });
  wishlist.items = wishlist.items.filter(i => i.toString() !== itemId);
  await wishlist.save();
  res.json(wishlist);
};