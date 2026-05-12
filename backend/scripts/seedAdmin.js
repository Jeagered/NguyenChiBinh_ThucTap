require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const connectDB = require('../config/db');
const User = require('../models/User');

const seedAdmin = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const name = process.env.ADMIN_NAME || 'Administrator';

  const existedAdmin = await User.findOne({ email });
  if (existedAdmin) {
    existedAdmin.role = 'admin';
    existedAdmin.isBlocked = false;
    if (process.env.ADMIN_PASSWORD) existedAdmin.password = password;
    await existedAdmin.save();
    console.log(`Admin updated: ${email}`);
    process.exit(0);
  }

  await User.create({ name, email, password, role: 'admin' });
  console.log(`Admin created: ${email}`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

