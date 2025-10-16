 const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/ContactMessageController');
const { adminMiddleware } = require('../middleware/adminMiddleware'); // for admin protection if needed

// User: send contact message
router.post('/', sendMessage);

// Admin: get all contact messages
router.get('/', adminMiddleware, getMessages);

module.exports = router;
