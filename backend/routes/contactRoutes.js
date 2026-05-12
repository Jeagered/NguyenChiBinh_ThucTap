const express = require('express');
const {
  createContactMessage,
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
} = require('../controllers/contactController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', createContactMessage);
router.get('/', protect, authorize('admin'), getContactMessages);
router.put('/:id', protect, authorize('admin'), updateContactMessage);
router.delete('/:id', protect, authorize('admin'), deleteContactMessage);

module.exports = router;
