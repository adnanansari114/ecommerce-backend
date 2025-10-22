const express = require('express');
const router = express.Router();
const { authUser } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const {
  placeOrder,
  getUserOrders,
  getOrderDetail,
  trackOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/OrderController');

router.post('/', authUser, placeOrder);
router.get('/', authUser, getUserOrders);
router.get('/:id', authUser, getOrderDetail);
router.get('/track/:id', authUser, trackOrder);
router.get('/admin/all', adminMiddleware, getAllOrders);
router.put('/admin/:id', adminMiddleware, updateOrderStatus);

module.exports = router;