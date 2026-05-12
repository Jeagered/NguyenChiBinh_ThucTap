const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Vui long nhap ho ten'], trim: true },
    email: { type: String, required: [true, 'Vui long nhap email'], trim: true },
    phone: { type: String, trim: true },
    subject: { type: String, default: 'Lien he tu website' },
    message: { type: String, required: [true, 'Vui long nhap noi dung'] },
    status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
