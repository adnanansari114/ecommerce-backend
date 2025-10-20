const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getUniqueColors
} = require('../controllers/ProductController');

// Multer setup for multiple images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({ storage }); 

// Public routes
router.get('/', getProducts); // /api/product/
router.get('/colors', getUniqueColors);
router.get('/:id', getProduct); // /api/product/:id
router.post('/', adminMiddleware, upload.array('images', 5), addProduct); // /api/product/
router.put('/:id', adminMiddleware, upload.array('images', 5), updateProduct); // /api/product/:id
router.delete('/:id', adminMiddleware, deleteProduct); // /api/product/:id

module.exports = router;