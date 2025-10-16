const express = require('express');
const router = express.Router();
const { authUser } = require('../middleware/authMiddleware');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/WishlistController');

router.get('/', authUser, getWishlist);
router.post('/', authUser, addToWishlist);
router.delete('/:itemId', authUser, removeFromWishlist);

module.exports = router;