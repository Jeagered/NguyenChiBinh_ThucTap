﻿import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import banner1 from '../assets/banner1.png';

const navItems = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Giới thiệu', to: '/about' },
  { label: 'Sản phẩm', to: '/products' },
  { label: 'Dịch vụ', to: '/services' },
  { label: 'Tin tức', to: '/news' },
  { label: 'Liên hệ', to: '/contact' },
];

function getStoredUser() {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return token && user ? user : null;
  } catch {
    return null;
  }
}

function SearchIcon() {
  return (
    <span className="relative block h-5 w-5 rounded-full border-2 border-current">
      <span className="absolute -bottom-1 -right-1 h-2 w-0.5 rotate-[-45deg] rounded-full bg-current" />
    </span>
  );
}

function CartIcon() {
  return (
    <span className="relative block h-5 w-5">
      <span className="absolute left-1 top-1 h-3 w-4 rounded-sm border-2 border-current" />
      <span className="absolute left-0 top-0 h-2 w-2 rounded-tl border-l-2 border-t-2 border-current" />
      <span className="absolute bottom-0 left-1 h-1.5 w-1.5 rounded-full bg-current" />
      <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-current" />
    </span>
  );
}

function UserIcon() {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition group-hover:bg-orange-500">
      <span className="relative block h-5 w-5">
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-current" />
        <span className="absolute bottom-0 left-1/2 h-2.5 w-4 -translate-x-1/2 rounded-t-full border-2 border-current border-b-0" />
      </span>
    </span>
  );
}

function NavBar() {
  const [user, setUser] = useState(() => getStoredUser());
  const [cartCount, setCartCount] = useState(0);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  useEffect(() => {
    const refreshUser = () => setUser(getStoredUser());
    window.addEventListener('storage', refreshUser);
    window.addEventListener('auth-updated', refreshUser);

    return () => {
      window.removeEventListener('storage', refreshUser);
      window.removeEventListener('auth-updated', refreshUser);
    };
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartCount(0);
        return;
      }
      try {
        const res = await fetch('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('auth-updated'));
          return;
        }
        
        const data = await res.json();
        if (data.success && data.data?.items) {
          const count = data.data.items.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };

    fetchCartCount();
    window.addEventListener('cart-updated', fetchCartCount);
    window.addEventListener('auth-updated', fetchCartCount);
    return () => {
      window.removeEventListener('cart-updated', fetchCartCount);
      window.removeEventListener('auth-updated', fetchCartCount);
    };
  }, []);

  useEffect(() => {
    const fetchUnreadChat = async () => {
      const token = localStorage.getItem('token');
      if (!token || user?.role === 'admin') return;
      try {
        const res = await fetch('http://localhost:5000/api/chat?markRead=false', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const unread = data.data.filter(msg => msg.sender === 'admin' && !msg.isRead).length;
          setUnreadChatCount(unread);
        }
      } catch (err) {}
    };

    fetchUnreadChat();
    const interval = setInterval(fetchUnreadChat, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const accountPath = user ? (user.role === 'admin' ? '/admin' : '/profile') : '/login';
  const visibleNavItems = navItems.filter((item) => !(user?.role === 'admin' && item.to === '/contact'));

  return (
    <div className="relative z-10 border-b border-white/10 bg-slate-950/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-3 text-white no-underline">
          <span className="grid h-11 w-11 place-items-center rounded-lg border-2 border-orange-500 text-sm font-black text-orange-400">
            TTG
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-black tracking-wide">THUCTAPGROUP</span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
              Giải pháp cơ khí
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Thanh điều hướng chính">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative border-b-2 pb-1 text-sm font-bold uppercase tracking-wide no-underline transition hover:border-orange-500 hover:text-orange-400 ${
                  isActive ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-200'
                }`
              }
            >
              {item.label}
              {item.to === '/contact' && unreadChatCount > 0 && (
                <span className="absolute -top-3 -right-4 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
                  {unreadChatCount > 99 ? '99+' : unreadChatCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-slate-200">
          <Link to="/products?focusSearch=true" className="hidden text-slate-200 no-underline hover:text-orange-400 sm:block" aria-label="Tìm kiếm">
            <SearchIcon />
          </Link>

          {user?.role !== 'admin' && (
            <Link to={user ? "/cart" : "/login"} className="relative text-slate-200 no-underline hover:text-orange-400" aria-label="Giỏ hàng">
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -right-3 -top-3 grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-xs font-bold text-white shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          <Link to={accountPath} className="group flex items-center gap-2 text-slate-100 no-underline" aria-label="Tài khoản người dùng">
            <UserIcon />
            {user && (
              <span className="hidden max-w-28 truncate text-sm font-black text-white lg:inline">
                {user.name || user.email}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Header({ variant = 'hero' }) {
  if (variant === 'compact') {
    return (
      <header className="bg-slate-950 text-white">
        <NavBar />
      </header>
    );
  }

  return (
    <header className="relative min-h-[560px] overflow-hidden bg-slate-900 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20000ms] ease-linear hover:scale-110"
        style={{ backgroundImage: `url(${banner1})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/55 to-slate-900/10" aria-hidden="true" />

      <NavBar />

      <div className="relative z-10 mx-auto flex max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="max-w-3xl text-left">
          <h1 className="m-0 text-4xl font-black uppercase leading-tight tracking-wide text-white md:text-6xl">
            Chào mừng đến với THUCTAPGROUP - giải pháp cơ khí chính xác
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-100">
            Đối tác tin cậy cung cấp các thiết bị, dịch vụ gia công và giải pháp kỹ thuật cơ khí hàng đầu.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-sm font-black uppercase tracking-wide text-white no-underline shadow-lg shadow-orange-500/30 transition-all hover:scale-105 hover:shadow-orange-500/50"
          >
            Tư vấn giải pháp ngay →
          </Link>
        </div>
      </div>
    </header>
  );
}
