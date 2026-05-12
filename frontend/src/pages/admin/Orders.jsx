import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.message || 'Không thể tải danh sách đơn hàng');
      }
    } catch (err) {
      setError('Lỗi kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });
      const data = await res.json();
      
      if (data.success) {
        fetchOrders();
      } else {
        alert(data.message || 'Lỗi khi cập nhật trạng thái');
      }
    } catch (err) {
      alert('Lỗi kết nối khi cập nhật trạng thái');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      
      if (data.success) {
        fetchOrders();
      } else {
        alert(data.message || 'Lỗi khi cập nhật trạng thái đơn hàng');
      }
    } catch (err) {
      alert('Lỗi kết nối khi cập nhật trạng thái đơn hàng');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">Quản lý đặt hàng</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-md bg-red-50 text-red-700 text-sm font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-slate-500 font-medium">Đang tải danh sách đơn hàng...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-sm uppercase tracking-wide text-slate-500 bg-slate-50">
                <th className="py-3 px-4">Mã ĐH</th>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Tổng tiền</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-800">{order.orderCode}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-700">{order.shippingAddress?.fullName}</p>
                    <p className="text-xs text-slate-500">{order.shippingAddress?.phone}</p>
                  </td>
                  <td className="py-3 px-4 font-bold text-orange-600">{formatPrice(order.total)}</td>
                  <td className="py-3 px-4">
                      <div className="flex flex-col gap-2 items-start">
                        {order.status !== 'cancelled' && (
                          order.paymentStatus === 'paid' ? (
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold uppercase">Đã thanh toán</span>
                          ) : order.paymentStatus === 'refunded' ? (
                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold uppercase">Hoàn tiền</span>
                          ) : (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase">Chưa thanh toán</span>
                          )
                        )}
                        
                        {order.status === 'pending' ? (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold uppercase">Chờ xác nhận</span>
                        ) : order.status === 'completed' ? (
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-bold uppercase">Hoàn thành</span>
                        ) : order.status === 'cancelled' ? (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold uppercase">Đã hủy</span>
                        ) : (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold uppercase">
                            {order.status === 'processing' ? 'Đang xử lý' : order.status === 'shipped' ? 'Đang giao' : order.status || 'Chờ xác nhận'}
                          </span>
                        )}
                      </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                      {order.status === 'cancelled' ? (
                        <span className="text-slate-400 font-medium text-sm italic pr-2">Không có hành động</span>
                      ) : (
                      <div className="flex flex-col gap-2 items-end">
                        <select 
                          value={order.paymentStatus} 
                          onChange={(e) => handleUpdatePaymentStatus(order._id, e.target.value)}
                          className="border border-slate-300 rounded p-1 text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none w-36"
                        >
                          <option value="unpaid">Chưa thanh toán</option>
                          <option value="paid">Đã thanh toán</option>
                          <option value="refunded">Hoàn tiền</option>
                        </select>
                        <select 
                          value={order.status || 'pending'} 
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="border border-slate-300 rounded p-1 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-36"
                        >
                          <option value="pending">Chờ xác nhận</option>
                          <option value="processing">Đang xử lý</option>
                          <option value="shipped">Đang giao</option>
                          <option value="completed">Hoàn thành</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </div>
                      )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 font-medium">Không có đơn hàng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
