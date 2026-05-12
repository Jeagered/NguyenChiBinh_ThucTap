const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Cong ty co khi' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    hotline: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    businessHours: { type: String, default: '' },
    facebook: { type: String, default: '' },
    youtube: { type: String, default: '' },
    zalo: { type: String, default: '' },
    mapEmbedUrl: { type: String, default: '' },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    aboutTitle: { type: String, default: '' },
    aboutContent: { type: String, default: '' },
    banners: [
      {
        title: { type: String, trim: true },
        subtitle: { type: String, trim: true },
        image: { type: String, trim: true },
        link: { type: String, trim: true },
        isActive: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
