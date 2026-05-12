const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: './.env' });

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    const users = await User.find({}, 'email role').lean();
    console.log('Users in DB:', users);
    
    const count = await User.countDocuments({ role: 'user' });
    console.log('Count of user role:', count);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

check();