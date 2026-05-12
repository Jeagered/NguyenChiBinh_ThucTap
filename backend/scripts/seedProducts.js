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

    // 1. Tạo danh mục mẫu trước nếu chưa có
    const categoryNames = ['Điện thoại', 'Laptop', 'Phụ kiện'];
    const categoryDocs = [];

    for (const name of categoryNames) {
      let category = await Category.findOne({ name });
      if (!category) {
        category = await Category.create({ 
          name: name, 
          slug: name.toLowerCase().replace(/ /g, '-').replace(/đ/g, 'd'),
          isActive: true,
          type: 'product'
        });
      }
      categoryDocs.push(category);
    }

    // 2. Định nghĩa các sản phẩm sử dụng ObjectId của category và trường chuẩn
    const sampleProducts = [
      {
        name: 'Sản phẩm 1',
        slug: 'san-pham-1',
        description: 'Mô tả sản phẩm 1',
        price: 100000,
        images: ['https://picsum.photos/seed/p1/400/300'],
        stock: 10,
        category: categoryDocs[0]._id,
      },
      {
        name: 'Sản phẩm 2',
        slug: 'san-pham-2',
        description: 'Mô tả sản phẩm 2',
        price: 120000,
        images: ['https://picsum.photos/seed/p2/400/300'],
        stock: 8,
        category: categoryDocs[1]._id,
      },
      {
        name: 'Sản phẩm 3',
        slug: 'san-pham-3',
        description: 'Mô tả sản phẩm 3',
        price: 90000,
        images: ['https://picsum.photos/seed/p3/400/300'],
        stock: 15,
        category: categoryDocs[0]._id,
      },
      {
        name: 'Sản phẩm 4',
        slug: 'san-pham-4',
        description: 'Mô tả sản phẩm 4',
        price: 150000,
        images: ['https://picsum.photos/seed/p4/400/300'],
        stock: 5,
        category: categoryDocs[2]._id,
      },
      {
        name: 'Sản phẩm 5',
        slug: 'san-pham-5',
        description: 'Mô tả sản phẩm 5',
        price: 110000,
        images: ['https://picsum.photos/seed/p5/400/300'],
        stock: 12,
        category: categoryDocs[1]._id,
      },
      {
        name: 'Sản phẩm 6',
        slug: 'san-pham-6',
        description: 'Mô tả sản phẩm 6',
        price: 130000,
        images: ['https://picsum.photos/seed/p6/400/300'],
        stock: 7,
        category: categoryDocs[0]._id,
      },
      {
        name: 'Sản phẩm 7',
        slug: 'san-pham-7',
        description: 'Mô tả sản phẩm 7',
        price: 95000,
        images: ['https://picsum.photos/seed/p7/400/300'],
        stock: 20,
        category: categoryDocs[2]._id,
      },
      {
        name: 'Sản phẩm 8',
        slug: 'san-pham-8',
        description: 'Mô tả sản phẩm 8',
        price: 105000,
        images: ['https://picsum.photos/seed/p8/400/300'],
        stock: 9,
        category: categoryDocs[1]._id,
      },
      {
        name: 'Sản phẩm 9',
        slug: 'san-pham-9',
        description: 'Mô tả sản phẩm 9',
        price: 99000,
        images: ['https://picsum.photos/seed/p9/400/300'],
        stock: 11,
        category: categoryDocs[0]._id,
      },
      {
        name: 'Sản phẩm 10',
        slug: 'san-pham-10',
        description: 'Mô tả sản phẩm 10',
        price: 140000,
        images: ['https://picsum.photos/seed/p10/400/300'],
        stock: 6,
        category: categoryDocs[2]._id,
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
