﻿﻿﻿﻿﻿import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setOrder(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    console.log("Đang hủy đơn hàng có ID:", id);
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
    setCanceling(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/orders/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        // Nếu không parse được JSON
        data = { message: 'Lỗi không đọc được phản hồi từ máy chủ.' };
      }
      if (res.ok && data.success) {
        alert('Đã hủy đơn hàng thành công!');
        setOrder(data.data); // Cập nhật lại state để hiển thị ngay trạng thái Đã hủy
      } else {
        // Hiển thị chi tiết lỗi từ BE (status code, message)
        let msg = `Lỗi khi hủy đơn hàng.\n`;
        msg += `Trạng thái: ${res.status} ${res.statusText}\n`;
        if (data.message) msg += `Chi tiết: ${data.message}`;
        else if (data.error) msg += `Chi tiết: ${data.error}`;
        else msg += 'Không rõ nguyên nhân.';
        alert(msg);
        console.error('Cancel order error:', data, res);
      }
    } catch (error) {
      alert('Lỗi kết nối khi hủy đơn hàng: ' + error.message);
      console.error('Cancel order network error:', error);
    } finally {
      setCanceling(false);
    }
  };

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header variant="compact" />
        <main className="flex-1 py-12 flex items-center justify-center">
          <p className="text-xl font-medium text-slate-500">Đang tải thông tin đơn hàng...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header variant="compact" />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-6">
          <Link to="/my-orders" className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-2">
            &larr; Quay lại danh sách đơn hàng
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wide">Đơn hàng {order.orderCode}</h2>
              <p className="text-slate-500 mt-1 text-sm font-medium">Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wide ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'completed' ? 'bg-green-100 text-green-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-800'}`}>
                {order.status === 'pending' ? 'Chờ xác nhận' : order.status === 'cancelled' ? 'Đã hủy' : order.status}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid md:grid-cols-2 gap-8 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-900 mb-4 tracking-wider">Thông tin người nhận</h3>
              <div className="space-y-2 text-slate-700 text-sm font-medium">
                <p><span className="text-slate-500 w-24 inline-block">Họ tên:</span> {order.shippingAddress?.fullName || 'Không có'}</p>
                <p><span className="text-slate-500 w-24 inline-block">Điện thoại:</span> {order.shippingAddress?.phone || 'Không có'}</p>
                <p><span className="text-slate-500 w-24 inline-block">Địa chỉ:</span> {order.shippingAddress?.street || 'Không có'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-slate-900 mb-4 tracking-wider">Thanh toán</h3>
              <div className="space-y-2 text-slate-700 text-sm font-medium">
                <p><span className="text-slate-500 w-32 inline-block">Phương thức:</span> {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản'}</p>
                <p><span className="text-slate-500 w-32 inline-block">Trạng thái:</span> <span className={order.paymentStatus === 'unpaid' ? 'text-red-600' : 'text-green-600'}>{order.paymentStatus === 'unpaid' ? 'Chưa thanh toán' : 'Đã thanh toán'}</span></p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <h3 className="text-sm font-black uppercase text-slate-900 mb-6 tracking-wider">Sản phẩm đã đặt</h3>
            <ul className="divide-y divide-slate-100">
              {order.items?.map((item) => (
                <li key={item.product} className="py-4 flex items-center gap-4">
                  <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="w-20 h-20 object-cover rounded-md border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">Đơn giá: {item.price.toLocaleString('vi-VN')} ₫</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">x{item.quantity}</p>
                    <p className="text-base font-bold text-orange-600 mt-1">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 p-6 sm:p-8 flex justify-end items-center gap-6 border-t border-slate-200">
            <span className="text-base font-bold text-slate-700 uppercase tracking-wider">Tổng thành tiền</span>
            <span className="text-3xl font-black text-orange-600">{order.total.toLocaleString('vi-VN')} ₫</span>
          </div>
        </div>

        {order.status === 'pending' && (
          <div className="mt-6 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-slate-200 text-center">
            <p className="text-slate-500 mb-4 text-sm font-medium">Bạn chỉ có thể hủy khi đơn hàng ở trạng thái "Chờ xác nhận". Sau khi hủy, thao tác này không thể hoàn tác.</p>
            <button
              onClick={handleCancelOrder}
              disabled={canceling}
              className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider px-8 py-3 rounded-md transition disabled:bg-slate-400"
            >
          {canceling ? 'Đang xử lý...' : 'Hủy đơn hàng này'}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
