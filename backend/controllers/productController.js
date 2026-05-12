const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination, formatPagination } = require('../utils/pagination');
const slugify = require('../utils/slugify');
const Product = require('../models/Product');

const buildProductFilter = (query, includeInactive = false) => {
  const filter = includeInactive ? {} : { isActive: true };

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { sku: { $regex: query.search, $options: 'i' } },
      { shortDescription: { $regex: query.search, $options: 'i' } },
    ];
  }
  if (query.category) filter.category = query.category;
  if (query.featured !== undefined) filter.isFeatured = query.featured === 'true';
  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  return filter;
};

const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const includeInactive = req.user?.role === 'admin' && req.query.admin === 'true';
  const filter = buildProductFilter(req.query, includeInactive);
  
  let sort = req.query.sort || '-createdAt';
  if (typeof sort === 'string' && !sort.includes('_id')) {
    sort += ' -_id';
  }

  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({ success: true, data: products, pagination: formatPagination(page, limit, total) });
});

const getProductByIdOrSlug = asyncHandler(async (req, res) => {
  const query = mongoose.isValidObjectId(req.params.idOrSlug)
    ? { _id: req.params.idOrSlug }
    : { slug: req.params.idOrSlug };
  const product = await Product.findOne(query).populate('category', 'name slug');

  if (!product || (!product.isActive && req.user?.role !== 'admin')) {
    res.status(404);
    throw new Error('Khong tim thay san pham');
  }

  res.json({ success: true, data: product });
});

const createProduct = asyncHandler(async (req, res) => {
  if (req.body.images && req.body.images.length > 5) {
    res.status(400);
    throw new Error('Chi duoc phep toi da 5 anh cho moi san pham');
  }

  const product = await Product.create({
    ...req.body,
    slug: req.body.slug || slugify(req.body.name),
  });

  res.status(201).json({ success: true, data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.images && payload.images.length > 5) {
    res.status(400);
    throw new Error('Chi duoc phep toi da 5 anh cho moi san pham');
  }

  if (!payload.slug && payload.name) payload.slug = slugify(payload.name);

  const oldProduct = await Product.findById(req.params.id);
  if (!oldProduct) {
    res.status(404);
    throw new Error('Khong tim thay san pham');
  }

  const product = await Product.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error('Khong tim thay san pham');
  }

  if (payload.images && Array.isArray(payload.images)) {
    const imagesToDelete = oldProduct.images.filter(img => !payload.images.includes(img));
    imagesToDelete.forEach(img => {
      if (img.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', img);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });
  }

  res.json({ success: true, data: product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Khong tim thay san pham');
  }

  if (product.images && product.images.length > 0) {
    product.images.forEach(img => {
      if (img.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', img);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Da xoa san pham' });
});

module.exports = { getProducts, getProductByIdOrSlug, createProduct, updateProduct, deleteProduct };
