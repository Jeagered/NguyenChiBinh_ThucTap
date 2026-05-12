const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép tải lên file ảnh (jpg, jpeg, png, webp)!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Tối đa 5MB cho 1 ảnh
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// API Upload nhiều ảnh (tối đa 5) - Chỉ Admin/Staff mới được upload
router.post('/', protect, authorize('admin', 'staff'), (req, res) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: 'Vui lòng chọn ít nhất 1 file ảnh' });

    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ success: true, message: 'Tải ảnh lên thành công', data: fileUrls });
  });
});

module.exports = router;