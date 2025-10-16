const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  price: Number,
  qty: Number,
  image: String
});

const statusHistorySchema = new mongoose.Schema({
  status: String,
  date: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  phone: String,
  paymentMethod: String,
  subtotal: Number,
  shipping: Number,
  tax: Number,
  discount: Number,
  total: Number,
  status: { type: String, default: "Processing" },
  statusHistory: [statusHistorySchema],
  tracking: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);