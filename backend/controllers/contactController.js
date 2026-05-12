const asyncHandler = require('../utils/asyncHandler');
const { getPagination, formatPagination } = require('../utils/pagination');
const ContactMessage = require('../models/ContactMessage');

const createContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create(req.body);
  res.status(201).json({ success: true, data: message });
});

const getContactMessages = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { phone: { $regex: req.query.search, $options: 'i' } },
      { subject: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [messages, total] = await Promise.all([
    ContactMessage.find(filter).sort('-createdAt').skip(skip).limit(limit),
    ContactMessage.countDocuments(filter),
  ]);

  res.json({ success: true, data: messages, pagination: formatPagination(page, limit, total) });
});

const updateContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!message) {
    res.status(404);
    throw new Error('Khong tim thay lien he');
  }

  res.json({ success: true, data: message });
});

const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error('Khong tim thay lien he');
  }

  await message.deleteOne();
  res.json({ success: true, message: 'Da xoa lien he' });
});

module.exports = { createContactMessage, getContactMessages, updateContactMessage, deleteContactMessage };
