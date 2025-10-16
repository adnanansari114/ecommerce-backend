const express = require('express');
const router = express.Router();
const { adminMiddleware } = require('../middleware/adminMiddleware');
const upload = require('../utils/upload'); // adjust if you have a custom upload util
const { addProduct, editProduct, deleteProduct, uploadProductImage } = require('../controllers/AdminController');

// Protect all admin routes
router.post('/products', adminMiddleware, addProduct);
router.put('/products/:id', adminMiddleware, editProduct);
router.delete('/products/:id', adminMiddleware, deleteProduct);
router.post('/products/upload', adminMiddleware, upload.single('image'), uploadProductImage);

module.exports = router;