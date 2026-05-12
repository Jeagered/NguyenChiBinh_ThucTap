﻿﻿﻿﻿﻿const asyncHandler = require('../utils/asyncHandler');
const { getPagination, formatPagination } = require('../utils/pagination');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrderCode = () => `CK${Date.now()}${Math.floor(Math.random() * 1000)}`;

const buildOrderItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Don hang can co it nhat 1 san pham');
  }

  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.product || item.productId);
    if (!product || !product.isActive) {
      throw new Error('Co san pham khong ton tai hoac da an');
    }

    const quantity = Number(item.quantity) || 1;
    if (product.stock < quantity) {
      throw new Error(`San pham ${product.name} khong du so luong trong kho`);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.salePrice > 0 ? product.salePrice : product.price,
      quantity,
    });
  }

  return orderItems;
};

const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'cod', shippingFee = 0, discount = 0 } = req.body;
  let items = req.body.items;

  if (!items || items.length === 0) {
    const cart = await Cart.findOne({ user: req.user._id });
    items = cart?.items || [];
  }

  const orderItems = await buildOrderItems(items);
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + Number(shippingFee) - Number(discount);

  const order = await Order.create({
    user: req.user._id,
    orderCode: createOrderCode(),
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingFee,
    discount,
    total,
  });

  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    )
  );

  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  res.status(201).json({ success: true, data: order });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { user: req.user._id };

  const [orders, total] = await Promise.all([
    Order.find(filter).sort('-createdAt -_id').skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  res.json({ success: true, data: orders, pagination: formatPagination(page, limit, total) });
});

const getOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
  if (req.query.search) filter.orderCode = { $regex: req.query.search, $options: 'i' };

  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email phone').sort('-createdAt -_id').skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  res.json({ success: true, data: orders, pagination: formatPagination(page, limit, total) });
});

const getOrderById = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id };
  if (req.user.role !== 'admin') filter.user = req.user._id;

  const order = await Order.findOne(filter).populate('user', 'name email phone');
  if (!order) {
    res.status(404);
    throw new Error('Khong tim thay don hang');
  }

  res.json({ success: true, data: order });
});

const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Khong tim thay don hang');
  }

  // Nếu cập nhật thông tin khác, bắt buộc người dùng phải là admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Khong co quyen cap nhat don hang');
  }

  const allowedFields = ['status', 'paymentStatus', 'adminNote', 'shippingFee', 'discount'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) order[field] = req.body[field];
  });

  order.total = order.subtotal + Number(order.shippingFee) - Number(order.discount);
  await order.save();

  res.json({ success: true, data: order });
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Khong tim thay don hang');
  }

  const orderUserId = order.user && (order.user._id ? order.user._id.toString() : order.user.toString());
  const currentUserId = req.user && (req.user._id ? req.user._id.toString() : '');
  
  const isOwner = orderUserId === currentUserId;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Bạn không có quyền thực hiện hành động này');
  }

  // Nếu người dùng là chủ sở hữu (nhưng không phải admin), họ chỉ có thể xóa nếu trạng thái là 'pending'
  if (isOwner && !isAdmin) {
    if (order.status !== 'pending') {
      res.status(400);
      throw new Error('Chỉ có thể xóa đơn hàng ở trạng thái "Chờ xác nhận"');
    }
  }

  // Hoàn lại số lượng hàng vào kho trước khi xóa
  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
    )
  );

  await order.deleteOne();
  res.json({ success: true, message: 'Đã xóa đơn hàng thành công' });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Khong tim thay don hang');
  }

  const orderUserId = order.user && (order.user._id ? order.user._id.toString() : order.user.toString());
  const currentUserId = req.user && (req.user._id ? req.user._id.toString() : '');
  
  const isOwner = orderUserId === currentUserId;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Bạn không có quyền thực hiện hành động này');
  }

  if (order.status !== 'pending') {
    res.status(400);
    throw new Error('Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận"');
  }

  // Hoàn lại số lượng hàng vào kho
  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
    )
  );

  order.status = 'cancelled';
  await order.save();

  res.json({ success: true, message: 'Đã hủy đơn hàng thành công', data: order });
});

module.exports = { createOrder, getMyOrders, getOrders, getOrderById, updateOrder, deleteOrder, cancelOrder };
