const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { sendMessage, getMessages, getConversations } = require('../controllers/chatController');

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/', protect, getMessages);
router.get('/:userId', protect, getMessages);

module.exports = router;