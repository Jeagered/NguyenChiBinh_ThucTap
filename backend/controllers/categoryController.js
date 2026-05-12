const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination, formatPagination } = require('../utils/pagination');
const slugify = require('../utils/slugify');
const Category = require('../models/Category');

const getCategories = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  const categories = await Category.find(filter).sort('name');
  res.json({ success: true, data: categories });
});

const getCategoryByIdOrSlug = asyncHandler(async (req, res) => {
  const query = mongoose.isValidObjectId(req.params.idOrSlug)
    ? { _id: req.params.idOrSlug }
    : { slug: req.params.idOrSlug };
  
  const category = await Category.findOne(query);
  if (!category) {
    res.status(404);
    throw new Error('Khong tim thay danh muc');
  }

  res.json({ success: true, data: category });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({
    ...req.body,
    slug: req.body.slug || slugify(req.body.name),
  });

  res.status(201).json({ success: true, data: category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (!payload.slug && payload.name) payload.slug = slugify(payload.name);

  const category = await Category.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    res.status(404);
    throw new Error('Khong tim thay danh muc');
  }

  res.json({ success: true, data: category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Khong tim thay danh muc');
  }

  await category.deleteOne();
  res.json({ success: true, message: 'Da xoa danh muc' });
});

module.exports = { getCategories, getCategoryByIdOrSlug, createCategory, updateCategory, deleteCategory };
