const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.placeOrder = async (req, res) => {
  try {
    const { shippingAddress, phone, paymentMethod, notes } = req.body;
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ msg: "Cart is empty" });

    let subtotal = 0;
    const items = cart.items.map(i => {
      subtotal += i.product.price * i.qty;
      return {
        product: i.product._id,
        name: i.product.title,
        price: i.product.price,
        qty: i.qty,
        image: i.product.images[0] || ""
      };
    });
    const shipping = 49;
    const tax = Math.round(subtotal * 0.12);
    const discount = 0;
    const total = subtotal + shipping + tax - discount;

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      phone,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      discount,
      total,
      status: "Processing",
      statusHistory: [{ status: "Processing" }],
      notes
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({ msg: "Order placed", order });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
};

exports.getOrderDetail = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
  if (!order) return res.status(404).json({ msg: "Order not found" });
  res.json(order);
};

exports.trackOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
  if (!order) return res.status(404).json({ msg: "Order not found" });
  res.json({ status: order.status, history: order.statusHistory });
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const { status, tracking } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ msg: "Order not found" });
  order.status = status;
  order.tracking = tracking || order.tracking;
  order.statusHistory.push({ status });
  await order.save();
  res.json({ msg: "Order status updated", order });
};