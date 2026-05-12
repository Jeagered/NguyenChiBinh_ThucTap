const asyncHandler = require('../utils/asyncHandler');
const Setting = require('../models/Setting');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Service = require('../models/Service');
const News = require('../models/News');

const getHomeData = asyncHandler(async (req, res) => {
  const [settings, categories, featuredProducts, latestProducts, featuredServices, latestNews] = await Promise.all([
    Setting.findOne(),
    Category.find({ type: 'product', isActive: true }).sort('name').limit(8),
    Product.find({ isActive: true, isFeatured: true }).populate('category', 'name slug').sort('-createdAt').limit(8),
    Product.find({ isActive: true }).populate('category', 'name slug').sort('-createdAt').limit(8),
    Service.find({ isActive: true, isFeatured: true }).sort('-createdAt').limit(6),
    News.find({ status: 'published' }).populate('category', 'name slug').sort('-publishedAt').limit(6),
  ]);

  res.json({
    success: true,
    data: {
      settings,
      categories,
      featuredProducts,
      latestProducts,
      featuredServices,
      latestNews,
    },
  });
});

module.exports = { getHomeData };
