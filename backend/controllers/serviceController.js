const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination, formatPagination } = require('../utils/pagination');
const slugify = require('../utils/slugify');
const Service = require('../models/Service');

const getServices = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = req.user?.role === 'admin' && req.query.admin === 'true' ? {} : { isActive: true };

  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { summary: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  if (req.query.category) filter.category = req.query.category;
  if (req.query.featured !== undefined) filter.isFeatured = req.query.featured === 'true';
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  const [services, total] = await Promise.all([
    Service.find(filter).populate('category', 'name slug').sort(req.query.sort || '-createdAt').skip(skip).limit(limit),
    Service.countDocuments(filter),
  ]);

  res.json({ success: true, data: services, pagination: formatPagination(page, limit, total) });
});

const getServiceByIdOrSlug = asyncHandler(async (req, res) => {
  const query = mongoose.isValidObjectId(req.params.idOrSlug)
    ? { _id: req.params.idOrSlug }
    : { slug: req.params.idOrSlug };
  const service = await Service.findOne(query).populate('category', 'name slug');

  if (!service || (!service.isActive && req.user?.role !== 'admin')) {
    res.status(404);
    throw new Error('Khong tim thay dich vu');
  }

  res.json({ success: true, data: service });
});

const createService = asyncHandler(async (req, res) => {
  const service = await Service.create({
    ...req.body,
    slug: req.body.slug || slugify(req.body.title),
  });

  res.status(201).json({ success: true, data: service });
});

const updateService = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (!payload.slug && payload.title) payload.slug = slugify(payload.title);

  const service = await Service.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!service) {
    res.status(404);
    throw new Error('Khong tim thay dich vu');
  }

  res.json({ success: true, data: service });
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Khong tim thay dich vu');
  }

  await service.deleteOne();
  res.json({ success: true, message: 'Da xoa dich vu' });
});

module.exports = { getServices, getServiceByIdOrSlug, createService, updateService, deleteService };
