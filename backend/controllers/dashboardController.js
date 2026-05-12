﻿const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const News = require('../models/News');
const Order = require('../models/Order');
const ContactMessage = require('../models/ContactMessage');

const getDashboardStats = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear();

  const [
    totalUsers,
    totalProducts,
    totalCategories,
    totalNews,
    totalOrders,
    pendingOrders,
    unreadContacts,
    revenueResult,
    latestOrders,
    monthlyRevenueRaw,
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Product.countDocuments(),
    Category.countDocuments(),
    News.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    ContactMessage.countDocuments({ status: 'new' }),
    Order.aggregate([
      {
        // Yêu cầu: Doanh thu chỉ được tính khi đơn hàng thỏa mãn ĐỒNG THỜI CẢ 2 điều kiện
        // Thêm điều kiện lọc theo năm hiện tại để đồng bộ với biểu đồ
        $match: {
          paymentStatus: 'paid', // 1. Trạng thái thanh toán phải là "Đã thanh toán"
          status: 'completed', // 2. Trạng thái đơn hàng phải là "Hoàn thành"
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          },
        },
      },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]),
    Order.find().populate('user', 'name email').sort('-createdAt').limit(5),
    // Truy vấn doanh thu theo từng tháng trong năm hiện tại
    Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          status: 'completed',
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          },
        },
      },
      { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$total' } } },
    ]),
  ]);

  // Định dạng lại kết quả cho đủ 12 tháng, tháng nào không có thì gán bằng 0
  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
    const monthData = monthlyRevenueRaw.find((item) => item._id === i + 1);
    return {
      name: `T${i + 1}`,
      revenue: monthData ? monthData.revenue : 0,
    };
  });

  res.json({
    success: true,
    data: {
      totalUsers,
      totalProducts,
      totalCategories,
      totalNews,
      totalOrders,
      pendingOrders,
      unreadContacts,
      totalRevenue: revenueResult[0]?.totalRevenue || 0,
      latestOrders,
      monthlyRevenue,
    },
  });
});

module.exports = { getDashboardStats };
