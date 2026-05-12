import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const sampleMonthlyRevenue = [
  { name: 'T1', revenue: 1500000 },
  { name: 'T2', revenue: 2200000 },
  { name: 'T3', revenue: 1800000 },
  { name: 'T4', revenue: 3100000 },
  { name: 'T5', revenue: 2500000 },
  { name: 'T6', revenue: 4000000 },
  { name: 'T7', revenue: 3500000 },
  { name: 'T8', revenue: 10000000 },
  { name: 'T9', revenue: 4200000 },
  { name: 'T10', revenue: 5500000 },
  { name: 'T11', revenue: 5100000 },
  { name: 'T12', revenue: 6800000 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingOrders: 0,
    totalUsers: 0,
    monthlyRevenue: sampleMonthlyRevenue,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const statsRes = await fetch(`${API_URL}/admin/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await statsRes.json();
        if (statsData.success && statsData.data) {
          setStats(prevStats => ({
            ...prevStats, 
            totalRevenue: statsData.data.totalRevenue || 0,
            pendingOrders: statsData.data.pendingOrders || 0,
            totalUsers: statsData.data.totalUsers || 0,
          }));
        }
      } catch (err) {
        console.error('Lỗi khi lấy thống kê:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const hasRevenueData = stats.monthlyRevenue.some(item => item.revenue > 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 uppercase tracking-wide">Thống kê doanh thu</h2>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
            <p className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-1">Tổng doanh thu</p>
            <p className="text-3xl font-black text-slate-900">{stats.totalRevenue.toLocaleString('vi-VN')} ₫</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-1">Đơn hàng mới</p>
            <p className="text-3xl font-black text-slate-900">{stats.pendingOrders}</p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-wide mb-1">Tài khoản User</p>
            <p className="text-3xl font-black text-slate-900">{stats.totalUsers}</p>
          </div>
        </div>
      )}
      
      <div className="mt-8 border-t border-slate-200 pt-6">
        <h3 className="text-lg font-bold text-slate-700 mb-6 uppercase tracking-wide">Biểu đồ doanh thu theo tháng (Năm {new Date().getFullYear()})</h3>
        
        {hasRevenueData ? (
          <div className="flex items-end justify-between gap-1 sm:gap-2 h-64 w-full">
            {stats.monthlyRevenue.map((item) => {
              const maxRevenue = Math.max(...stats.monthlyRevenue.map(d => d.revenue), 1);
              const heightPercent = (item.revenue / maxRevenue) * 100;
              return (
                <div key={item.name} className="flex flex-col items-center flex-1 group relative">
                  <div className="relative w-full flex justify-center h-52 items-end">
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-slate-800 text-white text-xs py-1.5 px-2 rounded whitespace-nowrap transition-opacity pointer-events-none z-10 shadow-md">
                      {item.revenue.toLocaleString('vi-VN')} ₫
                    </div>
                    <div
                      className="w-full max-w-[40px] bg-orange-500 rounded-t-md transition-all duration-700 hover:bg-orange-600"
                      style={{ height: `${heightPercent}%`, minHeight: heightPercent > 0 ? '4px' : '0' }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500 mt-3 font-semibold">{item.name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
            <p className="text-center text-slate-500 font-medium">
              Chưa có doanh thu trong năm nay để vẽ biểu đồ.
              <br />
              <span className="text-sm">Doanh thu chỉ được tính cho các đơn hàng "Đã thanh toán" và "Hoàn thành".</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
