import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const adminNavItems = [
  { label: 'Thống kê', path: '/admin' },
  { label: 'Người dùng', path: '/admin/users' },
  { label: 'Danh mục', path: '/admin/categories' },
  { label: 'Sản phẩm', path: '/admin/products' },
  { label: 'Đặt hàng', path: '/admin/orders' },
  { label: 'Dịch vụ', path: '/admin/services' },
  { label: 'Tin tức', path: '/admin/news' },
  { label: 'Tin nhắn', path: '/admin/chats' },
  { label: 'Cài đặt', path: '/admin/settings' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(`${API_URL}/chat/conversations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const unread = data.data.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
          setTotalUnread(unread);
        }
      } catch (err) {}
    };
    
    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-updated'));
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-900 text-white shadow-xl flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-white/10 px-6">
          <span className="text-xl font-black tracking-widest text-orange-500 uppercase">TTG ADMIN</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col gap-1 px-3">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-wide transition ${isActive
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span>{item.label}</span>
                {item.path === '/admin/chats' && totalUnread > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                    {totalUnread > 99 ? '99+' : totalUnread}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex-shrink-0 bg-white shadow-sm flex items-center px-8 justify-between">
          <h1 className="text-lg font-bold text-slate-800">Bảng điều khiển quản trị</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Xin chào, Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
