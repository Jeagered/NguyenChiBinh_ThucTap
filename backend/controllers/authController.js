const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

const sendAuthResponse = (res, user, statusCode = 200) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      isBlocked: user.isBlocked,
      addresses: user.addresses,
    },
  });
};

const register = asyncHandler(async (req, res) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET. Add JWT_SECRET to backend/.env and restart server');
  }

  const { name, email, password, phone } = req.body;

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    res.status(400);
    throw new Error('Email da duoc su dung');
  }

  const user = await User.create({ name, email, password, phone });
  sendAuthResponse(res, user, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Email hoac mat khau khong dung');
  }

  if (user.isBlocked) {
    res.status(403);
    throw new Error('Tai khoan da bi chan');
  }

  sendAuthResponse(res, user);
});

const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'email', 'phone', 'avatar', 'addresses'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] = req.body[field];
    }
  });

  const updatedUser = await req.user.save();
  res.json({ success: true, data: updatedUser });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    res.status(400);
    throw new Error('Mat khau hien tai khong dung');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Doi mat khau thanh cong' });
});

module.exports = { register, login, getProfile, updateProfile, changePassword };



