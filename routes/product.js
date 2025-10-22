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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({ storage }); 

router.get('/', getProducts);
router.get('/colors', getUniqueColors);
router.get('/:id', getProduct); 
router.post('/', adminMiddleware, upload.array('images', 5), addProduct);
router.put('/:id', adminMiddleware, upload.array('images', 5), updateProduct);
router.delete('/:id', adminMiddleware, deleteProduct); 

module.exports = router;