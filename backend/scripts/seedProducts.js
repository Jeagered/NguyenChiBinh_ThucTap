// scripts/seedProducts.js
// Script để seed 10 sản phẩm mẫu vào database, chỉ chạy 1 lần
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const db = require('../config/db');

async function seedProducts() {
  try {
    await db();

    // 1. Lấy danh sách các danh mục đã có sẵn
    const existingCategories = await Category.find({ type: 'product' });

    if (existingCategories.length === 0) {
      console.log('Không có danh mục sản phẩm nào trong database. Vui lòng tạo danh mục trước khi chạy seed!');
      process.exit(1);
    }

    // Hàm hỗ trợ tự động xoay vòng danh mục (đề phòng số lượng danh mục hiện có ít hơn 10)
    const getCategoryId = (index) => existingCategories[index % existingCategories.length]._id;

    // 2. Định nghĩa các sản phẩm sử dụng ObjectId của category và trường chuẩn
    const sampleProducts = [
      {
        name: 'Máy phay CNC đứng VF-2',
        slug: 'may-phay-cnc-dung-vf-2',
        description: 'Máy phay CNC hiện đại, độ chính xác cao phù hợp cho gia công khuôn mẫu.',
        price: 150000000,
        images: ['https://loremflickr.com/400/300/machinery?lock=1', 'https://loremflickr.com/400/300/machinery?lock=2', 'https://loremflickr.com/400/300/machinery?lock=3'],
        stock: 10,
        category: getCategoryId(0),
      },
      {
        name: 'Máy tiện CNC 2 trục',
        slug: 'may-tien-cnc-2-truc',
        description: 'Máy tiện CNC tốc độ cao, hỗ trợ tiện ren và gia công chi tiết trụ hiệu quả.',
        price: 120000000,
        images: ['https://loremflickr.com/400/300/machinery?lock=4', 'https://loremflickr.com/400/300/machinery?lock=5', 'https://loremflickr.com/400/300/machinery?lock=6'],
        stock: 8,
        category: getCategoryId(1),
      },
      {
        name: 'Máy cắt Laser Fiber 1000W',
        slug: 'may-cat-laser-fiber-1000w',
        description: 'Máy cắt Laser Fiber công suất 1000W, chuyên cắt thép lá, inox với đường cắt mịn.',
        price: 200000000,
        images: ['https://loremflickr.com/400/300/machinery?lock=7', 'https://loremflickr.com/400/300/machinery?lock=8', 'https://loremflickr.com/400/300/machinery?lock=9'],
        stock: 15,
        category: getCategoryId(2),
      },
      {
        name: 'Máy chấn tôn thủy lực 100T',
        slug: 'may-chan-ton-thuy-luc-100t',
        description: 'Máy chấn tôn thủy lực lực chấn 100 tấn, điều khiển CNC, độ chấn chính xác.',
        price: 180000000,
        images: ['https://loremflickr.com/400/300/machinery?lock=10', 'https://loremflickr.com/400/300/machinery?lock=11', 'https://loremflickr.com/400/300/machinery?lock=12'],
        stock: 5,
        category: getCategoryId(3),
      },
      {
        name: 'Máy hàn TIG công nghiệp',
        slug: 'may-han-tig-cong-nghiep',
        description: 'Máy hàn TIG dòng điện ổn định, thích hợp cho xưởng cơ khí và gia công kim loại.',
        price: 25000000,
        images: ['https://loremflickr.com/400/300/machinery?lock=13', 'https://loremflickr.com/400/300/machinery?lock=14', 'https://loremflickr.com/400/300/machinery?lock=15'],
        stock: 12,
        category: getCategoryId(4),
      },
      {
        name: 'Máy khoan cần CNC',
        slug: 'may-khoan-can-cnc',
        description: 'Máy khoan cần công suất lớn, khoan sâu và taro ren linh hoạt.',
        price: 85000000,
        images: ['https://loremflickr.com/400/300/machinery?lock=16', 'https://loremflickr.com/400/300/machinery?lock=17', 'https://loremflickr.com/400/300/machinery?lock=18'],
        stock: 7,
        category: getCategoryId(5),
      },
      {
        name: 'Máy mài phẳng tự động',
        slug: 'may-mai-phang-tu-dong',
        description: 'Máy mài phẳng vận hành tự động, mâm cặp từ tính mạnh mẽ.',
        price: 95000000,
        images: ['https://loremflickr.com/400/300/machinery?lock=19', 'https://loremflickr.com/400/300/machinery?lock=20', 'https://loremflickr.com/400/300/machinery?lock=21'],
        stock: 20,
        category: getCategoryId(6),
      },
      {
        name: 'Máy ép phun nhựa 150T',
        slug: 'may-ep-phun-nhua-150t',
        description: 'Máy ép nhựa lực ép 150 tấn, động cơ servo tiết kiệm điện.',
        price: 350000000,
        images: ['https://loremflickr.com/400/300/machinery?lock=22', 'https://loremflickr.com/400/300/machinery?lock=23', 'https://loremflickr.com/400/300/machinery?lock=24'],
        stock: 9,
        category: getCategoryId(7),
      },
      {
        name: 'Máy cắt dây EDM',
        slug: 'may-cat-day-edm',
        description: 'Máy cắt dây tia lửa điện EDM, gia công chi tiết vi mô, khuôn đùn.',
        price: 130000000,
        images: ['https://loremflickr.com/400/300/machinery?lock=25', 'https://loremflickr.com/400/300/machinery?lock=26', 'https://loremflickr.com/400/300/machinery?lock=27'],
        stock: 11,
        category: getCategoryId(8),
      },
      {
        name: 'Máy đột dập liên hợp CNC',
        slug: 'may-dot-dap-lien-hop-cnc',
        description: 'Máy đột dập đa năng, đột, cắt góc, cắt phôi thép góc nhanh chóng.',
        price: 210000000,
        images: ['https://loremflickr.com/400/300/machinery?lock=28', 'https://loremflickr.com/400/300/machinery?lock=29', 'https://loremflickr.com/400/300/machinery?lock=30'],
        stock: 6,
        category: getCategoryId(9),
      },
    ];

    await Product.insertMany(sampleProducts);
    console.log('Đã thêm 10 sản phẩm mẫu vào database!');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi seed sản phẩm:', error);
    process.exit(1);
  }
}

seedProducts();
