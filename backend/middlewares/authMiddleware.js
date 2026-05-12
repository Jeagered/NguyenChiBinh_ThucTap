const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const getBearerToken = (req) => {
  const authHeader = req.headers.authorization || '';
  return authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
};

const protect = asyncHandler(async (req, res, next) => {
  const token = getBearerToken(req);

  if (!token) {
    res.status(401);
    throw new Error('Ban can dang nhap de thuc hien thao tac nay');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    res.status(401);
    throw new Error('Tai khoan khong ton tai');
  }

  if (user.isBlocked) {
    res.status(403);
    throw new Error('Tai khoan da bi chan');
  }

  req.user = user;
  next();
});

const optionalProtect = asyncHandler(async (req, res, next) => {
  const token = getBearerToken(req);
  if (!token) {
    next();
    return;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  if (user && !user.isBlocked) req.user = user;

  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error('Ban khong co quyen truy cap');
  }

  next();
};

module.exports = { protect, optionalProtect, authorize };
