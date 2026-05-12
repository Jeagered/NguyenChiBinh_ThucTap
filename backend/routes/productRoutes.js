﻿const express = require('express');
const {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, optionalProtect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', optionalProtect, getProducts);
router.get('/:idOrSlug', optionalProtect, getProductByIdOrSlug);
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin', 'staff'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
