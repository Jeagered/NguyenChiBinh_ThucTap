const asyncHandler = require('../utils/asyncHandler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  res.json({ success: true, data: cart });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Khong tim thay san pham');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('So luong san pham trong kho khong du');
  }

  const cart = await getOrCreateCart(req.user._id);
  const currentItem = cart.items.find((item) => item.product.toString() === productId);
  const price = product.salePrice > 0 ? product.salePrice : product.price;

  if (currentItem) {
    currentItem.quantity += Number(quantity);
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || '',
      price,
      quantity: Number(quantity),
    });
  }

  await cart.save();
  res.status(201).json({ success: true, data: cart });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((cartItem) => cartItem.product.toString() === req.params.productId);

  if (!item) {
    res.status(404);
    throw new Error('San pham khong co trong gio hang');
  }

  if (Number(quantity) <= 0) {
    cart.items = cart.items.filter((cartItem) => cartItem.product.toString() !== req.params.productId);
  } else {
    item.quantity = Number(quantity);
  }

  await cart.save();
  res.json({ success: true, data: cart });
});

const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
  await cart.save();

  res.json({ success: true, data: cart });
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();

  res.json({ success: true, data: cart });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
