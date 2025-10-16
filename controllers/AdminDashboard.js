const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const lowStock = await Product.countDocuments({ stock: { $lt: 3 } });

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      lowStock
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    const usersCount = await User.countDocuments();
    const lowStock = await Product.countDocuments({ stock: { $lte: 5 } });

    // Optionally, get recent orders/products/users for quick actions
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');
    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      products: productsCount,
      orders: ordersCount,
      users: usersCount,
      lowStock,
      recentOrders,
      recentProducts,
      recentUsers
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};