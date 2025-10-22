 const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/ContactMessageController');
const { adminMiddleware } = require('../middleware/adminMiddleware');

router.post('/', sendMessage);
router.get('/', adminMiddleware, getMessages);

module.exports = router;
