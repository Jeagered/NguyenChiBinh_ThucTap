import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const sampleMonthlyRevenue = [
  { name: 'T1', revenue: 150000000 },
  { name: 'T2', revenue: 220000000 },
  { name: 'T3', revenue: 180000000 },
  { name: 'T4', revenue: 310000000 },
  { name: 'T5', revenue: 250000000 },
  { name: 'T6', revenue: 400000000 },
  { name: 'T7', revenue: 350000000 },
  { name: 'T8', revenue: 90000000 },
  { name: 'T9', revenue: 420000000 },
  { name: 'T10', revenue: 550000000 },
  { name: 'T11', revenue: 510000000 },
  { name: 'T12', revenue: 680000000 },
];

const mergeMonthlyRevenue = (monthlyRevenue = []) => {
  const revenueByMonth = new Map(
    monthlyRevenue.map((item) => [item.name, Number(item.revenue || 0)])
  );

  return sampleMonthlyRevenue.map((sampleItem) => {
    const realRevenue = revenueByMonth.get(sampleItem.name) || 0;

    return {
      ...sampleItem,
      revenue: realRevenue > 0 ? realRevenue : sampleItem.revenue,
      isSample: realRevenue <= 0,
    };
  });
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingOrders: 0,
    totalUsers: 0,
    monthlyRevenue: mergeMonthlyRevenue(),
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
          setStats((prevStats) => ({
            ...prevStats,
            totalRevenue: statsData.data.totalRevenue || 0,
            pendingOrders: statsData.data.pendingOrders || 0,
            totalUsers: statsData.data.totalUsers || 0,
            monthlyRevenue: mergeMonthlyRevenue(statsData.data.monthlyRevenue),
          }));
        }
      } catch (error) {
        console.error('Lỗi khi lấy thống kê:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const maxRevenue = Math.max(...stats.monthlyRevenue.map((item) => item.revenue), 1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-slate-800">Thống kê doanh thu</h2>

      {loading ? (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-orange-100 bg-orange-50 p-6">
            <p className="mb-1 text-sm font-bold uppercase tracking-wide text-orange-600">Tổng doanh thu</p>
            <p className="text-3xl font-black text-slate-900">{stats.totalRevenue.toLocaleString('vi-VN')} ₫</p>
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-6">
            <p className="mb-1 text-sm font-bold uppercase tracking-wide text-blue-600">Đơn hàng mới</p>
            <p className="text-3xl font-black text-slate-900">{stats.pendingOrders}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-6">
            <p className="mb-1 text-sm font-bold uppercase tracking-wide text-emerald-600">Tài khoản User</p>
            <p className="text-3xl font-black text-slate-900">{stats.totalUsers}</p>
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-slate-200 pt-6">
        <h3 className="mb-6 text-lg font-bold uppercase tracking-wide text-slate-700">
          Biểu đồ doanh thu theo tháng (Năm {new Date().getFullYear()})
        </h3>

        <div className="flex h-64 w-full items-end justify-between gap-1 sm:gap-2">
          {stats.monthlyRevenue.map((item) => {
            const heightPercent = (item.revenue / maxRevenue) * 100;

            return (
              <div key={item.name} className="group relative flex flex-1 flex-col items-center">
                <div className="relative flex h-52 w-full items-end justify-center">
                  <div className="pointer-events-none absolute -top-12 z-10 rounded bg-slate-800 px-2 py-1.5 text-xs text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 whitespace-nowrap">
                    {item.revenue.toLocaleString('vi-VN')} ₫
                    {item.isSample && <span className="block text-[10px] text-slate-300">Dữ liệu mẫu</span>}
                  </div>
                  <div
                    className={`w-full max-w-[40px] rounded-t-md transition-all duration-700 ${
                      item.isSample ? 'bg-slate-300 hover:bg-slate-400' : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                    style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                  />
                </div>
                <span className={`mt-3 text-xs font-semibold ${item.isSample ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-sm font-semibold text-slate-500">
          Cột màu cam là doanh thu thực tế. Cột màu xám dùng dữ liệu mẫu cho tháng chưa có doanh thu.
        </p>
      </div>
    </div>
  );
}
