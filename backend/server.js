﻿require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const newsRoutes = require('./routes/newsRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const settingRoutes = require('./routes/settingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CẤU HÌNH CORS THEO CÁCH 1 (MỞ CHO VERCEL VÀ LOCALHOST) ---
app.use(
  cors({
    origin: '*', // Cho phép tất cả các domain (bao gồm mọi link Vercel) gọi tới API
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Các phương thức HTTP cho phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các Header được chấp nhận khi FE gửi lên
  })
);
// -----------------------------------------------------------

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mechanical company API is running',
    version: '1.0.0',
  });
});

app.use('/api/home', homeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', require('./routes/chatRoutes'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  }
};

startServer();