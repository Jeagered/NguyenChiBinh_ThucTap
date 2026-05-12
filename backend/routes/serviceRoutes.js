const express = require('express');
const {
  getServices,
  getServiceByIdOrSlug,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, optionalProtect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', optionalProtect, getServices);
router.get('/:idOrSlug', optionalProtect, getServiceByIdOrSlug);
router.post('/', protect, authorize('admin'), createService);
router.put('/:id', protect, authorize('admin'), updateService);
router.delete('/:id', protect, authorize('admin'), deleteService);

module.exports = router;
