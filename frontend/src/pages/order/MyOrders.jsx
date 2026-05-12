﻿import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const API_URL = 'http://localhost:5000/api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setOrders(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header variant="compact" />
        <main className="flex-1 py-12 flex items-center justify-center">
          <p className="text-xl font-medium text-slate-500">Đang tải...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header variant="compact" />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-wide mb-8">Lịch sử đơn hàng của tôi</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-center">
            <p className="text-slate-500 font-medium">Bạn chưa có đơn hàng nào.</p>
            <Link to="/products" className="mt-4 inline-block px-6 py-2 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition">Mua sắm ngay</Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-sm uppercase tracking-wider">
                  <th className="p-4 border-b border-slate-200 font-bold">Mã ĐH</th>
                  <th className="p-4 border-b border-slate-200 font-bold">Ngày đặt</th>
                  <th className="p-4 border-b border-slate-200 font-bold">Tổng tiền</th>
                  <th className="p-4 border-b border-slate-200 font-bold">Trạng thái</th>
                  <th className="p-4 border-b border-slate-200 font-bold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition">
                    <td className="p-4 text-slate-900 font-bold">{order.orderCode}</td>
                    <td className="p-4 text-slate-600">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 text-orange-600 font-bold">{order.total.toLocaleString('vi-VN')} ₫</td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'completed' ? 'bg-green-100 text-green-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}`}>
                        {order.status === 'pending' ? 'Chờ xác nhận' : order.status === 'cancelled' ? 'Đã hủy' : order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/orders/${order._id}`} className="text-sm font-bold text-orange-600 hover:text-orange-700">Xem chi tiết &rarr;</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
