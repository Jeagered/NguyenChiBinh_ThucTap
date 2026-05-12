﻿const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination, formatPagination } = require('../utils/pagination');
const slugify = require('../utils/slugify');
const News = require('../models/News');

const getNewsList = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const isAdminView = req.user?.role === 'admin' && req.query.admin === 'true';
  const filter = isAdminView ? {} : { status: 'published' };

  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { excerpt: { $regex: req.query.search, $options: 'i' } },
      { tags: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  if (req.query.category) filter.category = req.query.category;
  if (req.query.status && isAdminView) filter.status = req.query.status;
  
  if (req.query.startDate || req.query.endDate) {
    filter.publishedAt = {};
    if (req.query.startDate) filter.publishedAt.$gte = new Date(req.query.startDate);
    if (req.query.endDate) filter.publishedAt.$lte = new Date(req.query.endDate);
  }

  const [news, total] = await Promise.all([
    News.find(filter)
      .populate('category', 'name slug')
      .populate('author', 'name email')
      .sort(req.query.sort || '-publishedAt')
      .skip(skip)
      .limit(limit),
    News.countDocuments(filter),
  ]);

  res.json({ success: true, data: news, pagination: formatPagination(page, limit, total) });
});

const getNewsByIdOrSlug = asyncHandler(async (req, res) => {
  const query = mongoose.isValidObjectId(req.params.idOrSlug)
    ? { _id: req.params.idOrSlug }
    : { slug: req.params.idOrSlug };
  const item = await News.findOne(query).populate('category', 'name slug').populate('author', 'name email');

  if (!item || (item.status !== 'published' && req.user?.role !== 'admin')) {
    res.status(404);
    throw new Error('Khong tim thay tin tuc');
  }

  if (item.status === 'published') {
    item.views += 1;
    await item.save();
  }

  res.json({ success: true, data: item });
});

const createNews = asyncHandler(async (req, res) => {
  const item = await News.create({
    ...req.body,
    slug: req.body.slug || slugify(req.body.title),
    author: req.user._id,
  });

  res.status(201).json({ success: true, data: item });
});

const updateNews = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (!payload.slug && payload.title) payload.slug = slugify(payload.title);

  const item = await News.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!item) {
    res.status(404);
    throw new Error('Khong tim thay tin tuc');
  }

  res.json({ success: true, data: item });
});

const deleteNews = asyncHandler(async (req, res) => {
  const item = await News.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Khong tim thay tin tuc');
  }

  await item.deleteOne();
  res.json({ success: true, message: 'Da xoa tin tuc' });
});

module.exports = { getNewsList, getNewsByIdOrSlug, createNews, updateNews, deleteNews };
