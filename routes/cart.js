const express = require('express');
const router = express.Router();
const { authUser } = require('../middleware/authMiddleware');
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} = require('../controllers/CartController');

router.get('/', authUser, getCart);
router.post('/', authUser, addToCart);
router.delete('/:itemId', authUser, removeFromCart);
router.delete('/', authUser, clearCart);


module.exports = router;