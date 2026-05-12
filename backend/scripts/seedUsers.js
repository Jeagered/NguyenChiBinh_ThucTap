// scripts/seedUsers.js
// Script để seed 10 người dùng mẫu vào database
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const db = require('../config/db');

async function seedUsers() {
  try {
    await db();

    const createUser = async (userData) => {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData);
        console.log(`Đã tạo: ${userData.email}`);
      } else {
        console.log(`Đã tồn tại: ${userData.email}`);
      }
    };

    console.log('Bắt đầu tạo người dùng...');

    await createUser({
      name: "Nguyễn Văn Toàn",
      email: "user1@example.com",
      password: "Password@123",
      phone: "0900000001",
      avatar: "https://i.pravatar.cc/150?img=11",
      role: "user",
      isBlocked: false,
      addresses: [{ fullName: "Nguyễn Văn Toàn", phone: "0900000001", street: "Số 1 Đường Ví Dụ, Phường Mẫu, Quận Test, TP.HCM", isDefault: true }]
    });

    await createUser({
      name: "Trần Thu Hà",
      email: "user2@example.com",
      password: "Password@123",
      phone: "0900000002",
      avatar: "https://i.pravatar.cc/150?img=12",
      role: "user",
      isBlocked: false,
      addresses: [{ fullName: "Trần Thu Hà", phone: "0900000002", street: "Số 2 Đường Ví Dụ, Phường Mẫu, Quận Test, TP.HCM", isDefault: true }]
    });

    await createUser({
      name: "Lê Trọng Tấn",
      email: "user3@example.com",
      password: "Password@123",
      phone: "0900000003",
      avatar: "https://i.pravatar.cc/150?img=13",
      role: "user",
      isBlocked: false,
      addresses: [{ fullName: "Lê Trọng Tấn", phone: "0900000003", street: "Số 3 Đường Ví Dụ, Phường Mẫu, Quận Test, TP.HCM", isDefault: true }]
    });

    await createUser({
      name: "Phạm Mai Phương",
      email: "user4@example.com",
      password: "Password@123",
      phone: "0900000004",
      avatar: "https://i.pravatar.cc/150?img=14",
      role: "user",
      isBlocked: false,
      addresses: [{ fullName: "Phạm Mai Phương", phone: "0900000004", street: "Số 4 Đường Ví Dụ, Phường Mẫu, Quận Test, TP.HCM", isDefault: true }]
    });

    await createUser({
      name: "Hoàng Anh Tú",
      email: "user5@example.com",
      password: "Password@123",
      phone: "0900000005",
      avatar: "https://i.pravatar.cc/150?img=15",
      role: "user",
      isBlocked: false,
      addresses: [{ fullName: "Hoàng Anh Tú", phone: "0900000005", street: "Số 5 Đường Ví Dụ, Phường Mẫu, Quận Test, TP.HCM", isDefault: true }]
    });

    await createUser({
      name: "Đặng Thùy Trâm",
      email: "user6@example.com",
      password: "Password@123",
      phone: "0900000006",
      avatar: "https://i.pravatar.cc/150?img=16",
      role: "user",
      isBlocked: false,
      addresses: [{ fullName: "Đặng Thùy Trâm", phone: "0900000006", street: "Số 6 Đường Ví Dụ, Phường Mẫu, Quận Test, TP.HCM", isDefault: true }]
    });

    await createUser({
      name: "Vũ Hải Đăng",
      email: "user7@example.com",
      password: "Password@123",
      phone: "0900000007",
      avatar: "https://i.pravatar.cc/150?img=17",
      role: "user",
      isBlocked: false,
      addresses: [{ fullName: "Vũ Hải Đăng", phone: "0900000007", street: "Số 7 Đường Ví Dụ, Phường Mẫu, Quận Test, TP.HCM", isDefault: true }]
    });

    await createUser({
      name: "Đỗ Minh Khôi",
      email: "user8@example.com",
      password: "Password@123",
      phone: "0900000008",
      avatar: "https://i.pravatar.cc/150?img=18",
      role: "user",
      isBlocked: false,
      addresses: [{ fullName: "Đỗ Minh Khôi", phone: "0900000008", street: "Số 8 Đường Ví Dụ, Phường Mẫu, Quận Test, TP.HCM", isDefault: true }]
    });

    await createUser({
      name: "Hồ Thanh Nga",
      email: "user9@example.com",
      password: "Password@123",
      phone: "0900000009",
      avatar: "https://i.pravatar.cc/150?img=19",
      role: "user",
      isBlocked: false,
      addresses: [{ fullName: "Hồ Thanh Nga", phone: "0900000009", street: "Số 9 Đường Ví Dụ, Phường Mẫu, Quận Test, TP.HCM", isDefault: true }]
    });

    await createUser({
      name: "Ngô Quốc Bảo",
      email: "user10@example.com",
      password: "Password@123",
      phone: "0900000010",
      avatar: "https://i.pravatar.cc/150?img=20",
      role: "user",
      isBlocked: false,
      addresses: [{ fullName: "Ngô Quốc Bảo", phone: "0900000010", street: "Số 10 Đường Ví Dụ, Phường Mẫu, Quận Test, TP.HCM", isDefault: true }]
    });

    console.log('Hoàn tất xử lý người dùng!');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi seed người dùng:', error);
    process.exit(1);
  }
}

seedUsers();
