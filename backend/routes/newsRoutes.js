const express = require('express');
const {
  getNewsList,
  getNewsByIdOrSlug,
  createNews,
  updateNews,
  deleteNews,
} = require('../controllers/newsController');
const { protect, optionalProtect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', optionalProtect, getNewsList);
router.get('/:idOrSlug', optionalProtect, getNewsByIdOrSlug);
router.post('/', protect, authorize('admin'), createNews);
router.put('/:id', protect, authorize('admin'), updateNews);
router.delete('/:id', protect, authorize('admin'), deleteNews);

module.exports = router;
