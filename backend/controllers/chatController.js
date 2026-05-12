const asyncHandler = require('../utils/asyncHandler');
const Message = require('../models/Message');

// [POST] Gửi tin nhắn
const sendMessage = asyncHandler(async (req, res) => {
  const { content, userId } = req.body;
  const role = req.user.role;
  
  // Nếu là user gửi, target user chính là họ. Nếu admin gửi, target user do admin chọn.
  const targetUserId = role === 'admin' ? userId : req.user._id;

  if (!content) {
    res.status(400);
    throw new Error('Nội dung tin nhắn không được để trống');
  }

  const message = await Message.create({
    user: targetUserId,
    sender: role,
    content,
    isRead: false
  });

  res.status(201).json({ success: true, data: message });
});

// [GET] Lấy lịch sử tin nhắn của 1 User
const getMessages = asyncHandler(async (req, res) => {
  const role = req.user.role;
  const targetUserId = role === 'admin' ? req.params.userId : req.user._id;

  const markRead = req.query.markRead !== 'false';

  if (markRead) {
    // Đánh dấu tin nhắn là đã đọc khi mở hộp thoại
    if (role === 'admin') {
      await Message.updateMany({ user: targetUserId, sender: 'user', isRead: { $ne: true } }, { $set: { isRead: true } });
    } else {
      await Message.updateMany({ user: targetUserId, sender: 'admin', isRead: { $ne: true } }, { $set: { isRead: true } });
    }
  }

  const messages = await Message.find({ user: targetUserId }).sort('createdAt');
  res.json({ success: true, data: messages });
});

// [GET] Lấy danh sách các hộp thoại (Dành cho Admin)
const getConversations = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Không có quyền truy cập');
  }

  const conversations = await Message.aggregate([
    { $sort: { createdAt: -1 } },
    { $group: { 
        _id: '$user', 
        lastMessage: { $first: '$content' }, 
        lastMessageAt: { $first: '$createdAt' },
        unreadCount: { 
          $sum: { 
            $cond: [{ $and: [{ $eq: ['$sender', 'user'] }, { $ne: ['$isRead', true] }] }, 1, 0] 
          } 
        }
      } 
    },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userInfo' } },
    { $unwind: '$userInfo' },
    { $project: { userId: '$_id', userName: '$userInfo.name', userEmail: '$userInfo.email', userAvatar: '$userInfo.avatar', lastMessage: 1, lastMessageAt: 1, unreadCount: 1 } },
    { $sort: { lastMessageAt: -1 } }
  ]);

  res.json({ success: true, data: conversations });
});

module.exports = { sendMessage, getMessages, getConversations };