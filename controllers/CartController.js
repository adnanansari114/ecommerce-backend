const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  res.json(cart || { user: req.user.id, items: [] });
};

// Add/update cart item
exports.addToCart = async (req, res) => {
  const { productId, qty } = req.body;
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = new Cart({ user: req.user.id, items: [] });

  const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].qty = qty;
  } else {
    cart.items.push({ product: productId, qty });
  }
  cart.updatedAt = Date.now();
  await cart.save();
  res.json(cart);
};

// Remove cart item
exports.removeFromCart = async (req, res) => {
  const { itemId } = req.params;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ msg: "Cart not found" });
  cart.items = cart.items.filter(i => i._id.toString() !== itemId);
  cart.updatedAt = Date.now();
  await cart.save();
  res.json(cart);
};

// Clear cart (after order placed)
exports.clearCart = async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
  res.json({ msg: "Cart cleared" });
};