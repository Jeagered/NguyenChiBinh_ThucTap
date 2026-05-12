﻿const asyncHandler = require('../utils/asyncHandler');
const { getPagination, formatPagination } = require('../utils/pagination');
const User = require('../models/User');

const getUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { phone: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  if (req.query.role) filter.role = req.query.role;
  if (req.query.isBlocked !== undefined) filter.isBlocked = req.query.isBlocked === 'true';

  const [users, total] = await Promise.all([
    User.find(filter).select('-password').sort({ role: 1, createdAt: -1, _id: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.json({ success: true, data: users, pagination: formatPagination(page, limit, total) });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('Khong tim thay nguoi dung');
  }

  res.json({ success: true, data: user });
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email da duoc su dung');
  }

  if (role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount >= 2) {
      res.status(400);
      throw new Error('He thong chi cho phep toi da 2 Admin');
    }
  } else if (role === 'staff') {
    const staffCount = await User.countDocuments({ role: 'staff' });
    if (staffCount >= 3) {
      res.status(400);
      throw new Error('He thong chi cho phep toi da 3 Staff');
    }
  }

  const user = await User.create({ name, email, password, role: role || 'user' });
  res.status(201).json({ success: true, data: user });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Khong tim thay nguoi dung');
  }

  // Kiem tra gioi han so luong role (Toi da 2 Admin, 3 Staff)
  if (req.body.role && req.body.role !== user.role) {
    if (req.body.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount >= 2) {
        res.status(400);
        throw new Error('He thong chi cho phep toi da 2 Admin');
      }
    } else if (req.body.role === 'staff') {
      const staffCount = await User.countDocuments({ role: 'staff' });
      if (staffCount >= 3) {
        res.status(400);
        throw new Error('He thong chi cho phep toi da 3 Staff');
      }
    }
  }

  const allowedFields = ['name', 'phone', 'avatar', 'role', 'isBlocked', 'addresses'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  // Cho phép Admin đặt lại mật khẩu cho User
  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();
  res.json({ success: true, data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Khong tim thay nguoi dung');
  }

  await user.deleteOne();
  res.json({ success: true, message: 'Da xoa nguoi dung' });
});

const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Khong tim thay nguoi dung');
  }

  user.isBlocked = req.body?.isBlocked !== undefined ? req.body.isBlocked : !user.isBlocked;
  await user.save();

  res.json({ success: true, data: user });
});

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, toggleBlockUser };
