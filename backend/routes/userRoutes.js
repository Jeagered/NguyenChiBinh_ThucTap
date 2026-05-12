﻿const express = require('express');
const { getUsers, getUserById, createUser, updateUser, deleteUser, toggleBlockUser } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.patch('/:id/block', toggleBlockUser);
router.delete('/:id', deleteUser);

module.exports = router;
