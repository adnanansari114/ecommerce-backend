const Order = require('../models/Order');
const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');
const User = require('../models/User');

exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.countDocuments({ user: userId });
    const wishlist = await Wishlist.findOne({ user: userId });
    const cart = await Cart.findOne({ user: userId });
    const user = await User.findById(userId);

    res.json({
      orders,
      wishlist: wishlist ? wishlist.items.length : 0,
      cart: cart ? cart.items.length : 0,
      addresses: user && user.address ? 1 : 0 
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};