﻿const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { PASSWORD_REQUIREMENT_MESSAGE, isValidPassword } = require('../utils/passwordPolicy');

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    phone: { type: String, trim: true },
    province: { type: String, trim: true },
    district: { type: String, trim: true },
    ward: { type: String, trim: true },
    street: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Vui long nhap ho ten'], trim: true },
    email: {
      type: String,
      required: [true, 'Vui long nhap email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Vui long nhap mat khau'],
      validate: {
        validator: isValidPassword,
        message: PASSWORD_REQUIREMENT_MESSAGE,
      },
      select: false,
    },
    phone: { type: String, trim: true },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin', 'staff'], default: 'user' },
    isBlocked: { type: Boolean, default: false },
    addresses: [addressSchema],
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
