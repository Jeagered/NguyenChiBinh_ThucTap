﻿﻿﻿import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [fetchingCart, setFetchingCart] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Lấy thông tin người dùng từ localStorage để tự động điền địa chỉ giao hàng
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            const defaultAddress = user.addresses?.[0];
            if (defaultAddress) {
              setShippingAddress({
                fullName: defaultAddress.fullName || user.name || '',
                phone: defaultAddress.phone || user.phone || '',
                street: defaultAddress.street || '',
              });
            } else {
              setShippingAddress(prev => ({ ...prev, fullName: user.name || '', phone: user.phone || '' }));
            }
          } catch (e) {
            console.error('Lỗi phân tích dữ liệu user:', e);
          }
        }
        
        const res = await fetch(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setCart(data.data);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setFetchingCart(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleCheckout = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shippingAddress, paymentMethod }),
      });
      const data = await res.json();

      if (data.success) {
        window.alert('Đặt hàng thành công!');
        navigate('/my-orders');
      } else {
        window.alert(data.message || 'Lỗi đặt hàng');
      }
    } catch (error) {
      console.error(error);
      window.alert('Đã xảy ra lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingCart) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header variant="compact" />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-xl font-medium text-slate-500">Đang tải thông tin...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header variant="compact" />
        <main className="flex-1 py-16 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Giỏ hàng trống</h2>
          <p className="text-slate-500 mb-6">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
          <Link to="/products" className="inline-flex items-center rounded-md bg-orange-600 px-6 py-3 text-sm font-medium text-white hover:bg-orange-700 transition">
            Tiếp tục mua sắm
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header variant="compact" />
      
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-slate-900">Thanh toán đơn hàng</h1>

          <form onSubmit={handleCheckout} className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            
            <div className="space-y-8">
              <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b pb-2">1. Thông tin giao hàng</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Họ tên người nhận</label>
                    <input type="text" required className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" value={shippingAddress.fullName} onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                    <input type="text" required className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ chi tiết</label>
                    <input type="text" required className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" value={shippingAddress.street} onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b pb-2">2. Phương thức thanh toán</h3>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                  <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                  <option value="bank_transfer">Chuyển khoản qua ngân hàng</option>
                </select>
              </div>
            </div>

            <div>
              <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200 sticky top-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b pb-2">3. Tổng quan đơn hàng</h3>
                
                <ul className="divide-y divide-slate-100 mb-4">
                  {cart.items.map((item) => (
                    <li key={item.product} className="py-3 flex justify-between text-sm">
                      <span className="text-slate-600 line-clamp-1 pr-4">{item.name} <strong className="text-slate-900">x{item.quantity}</strong></span>
                      <strong className="text-slate-900 whitespace-nowrap">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</strong>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-slate-200 pt-4 flex justify-between items-center mb-6">
                  <span className="text-base font-medium text-slate-900">Tổng cộng</span>
                  <strong className="text-xl font-bold text-orange-600">{totalAmount.toLocaleString('vi-VN')} ₫</strong>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-orange-600 px-4 py-3 text-base font-bold text-white shadow hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition disabled:bg-slate-400"
                >
                  {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                </button>
              </div>
            </div>

          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
