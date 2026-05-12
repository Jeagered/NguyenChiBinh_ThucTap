const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Vui long nhap ten san pham'], trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, trim: true, unique: true, sparse: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    price: { type: Number, required: [true, 'Vui long nhap gia'], min: 0 },
    salePrice: { type: Number, min: 0, default: 0 },
    stock: { type: Number, min: 0, default: 0 },
    unit: { type: String, default: 'cai' },
    images: {
      type: [{ type: String }],
      validate: [(val) => val.length <= 5, 'Toi da 5 anh cho 1 san pham']
    },
    specifications: [
      {
        name: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],
    material: { type: String, default: '' },
    origin: { type: String, default: '' },
    brand: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
