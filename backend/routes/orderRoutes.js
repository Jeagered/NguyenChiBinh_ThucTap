﻿﻿﻿const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  cancelOrder,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/', authorize('admin'), getOrders);

router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.put('/:id', updateOrder);
// Route để xóa đơn hàng. Logic quyền (admin hoặc chủ sở hữu) được xử lý trong controller.
router.delete('/:id', deleteOrder);

module.exports = router;