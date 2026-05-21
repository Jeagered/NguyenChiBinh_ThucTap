﻿import { Link } from 'react-router-dom';
import { FaFacebookF, FaYoutube, FaGoogle } from "react-icons/fa";
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const quickLinks = [
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

export default function Footer() {
    const [user, setUser] = useState(() => getStoredUser());
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API_URL}/settings`);
                const data = await res.json();
                if (data.success && data.data) {
                    setSettings(data.data);
                }
            } catch (error) {
                console.error('Lỗi khi tải cài đặt:', error);
            }
        };
        fetchSettings();
    }, []);

    const socials = [
        {
            icon: <FaFacebookF />,
            link: "https://www.facebook.com/",
        },
        {
            icon: (
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
                    alt="zalo"
                    className="h-4 w-4"
                />
            ),
            link: "zalo://conv?phone=0349156766",
        },
        {
            icon: <FaYoutube />,
            link: "https://www.youtube.com/",
        },
        {
            icon: <FaGoogle />,
            link: "https://mail.google.com/mail/?view=cm&fs=1&to=nguyenchibinh.260104@gmail.com",
        },
    ];

    useEffect(() => {
        const refreshUser = () => setUser(getStoredUser());
        window.addEventListener('storage', refreshUser);
        window.addEventListener('auth-updated', refreshUser);

        return () => {
            window.removeEventListener('storage', refreshUser);
            window.removeEventListener('auth-updated', refreshUser);
        };
    }, []);

    const visibleLinks = quickLinks.filter((item) => !(user?.role === 'admin' && item.to === '/contact'));

    return (
        <footer className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 text-white">
            <div className="absolute -right-10 top-4 h-32 w-32 rotate-45 rounded-[28px] bg-slate-300/20" aria-hidden="true" />

            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
                <div>
                    <Link to="/" className="flex items-center gap-3 text-white no-underline">
                        <span className="grid h-12 w-12 place-items-center rounded-lg border-2 border-orange-500 text-sm font-black text-orange-400">
                            TTG
                        </span>
                        <span className="leading-tight">
                            <span className="block text-lg font-black tracking-wide">THUCTAPGROUP</span>
                            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                                Engineering solutions
                            </span>
                        </span>
                    </Link>
                    <p className="mt-5 max-w-sm text-sm font-medium leading-7 text-slate-300">
                        Đối tác cơ khí tin cậy, cung cấp thiết bị, gia công chính xác và giải pháp kỹ thuật cho doanh nghiệp sản xuất.
                    </p>
                    <p className="mt-4 text-sm italic leading-7 text-slate-400">
                    Địa chỉ: {settings?.address || '7/10F ấp 1, Bà Điểm, Hồ Chí Minh, Việt Nam'}<br />
                    Điện thoại: {settings?.hotline || '0349 156 766'}<br />
                    Email: {settings?.email || 'nguyenchibinh.260104@gmail.com'}<br />
                    Zalo: {settings?.zalo || '0349 156 766'}
                    </p>
                </div>

                <div>
                    <h3 className="m-0 text-sm font-black uppercase tracking-wide text-white">Liên kết nhanh</h3>
                    <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm font-bold uppercase text-slate-300 md:grid-cols-1">
                        {visibleLinks.map((item) => (
                            <Link key={item.to} to={item.to} className="text-slate-300 no-underline transition hover:text-orange-400">
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="m-0 text-sm font-black uppercase tracking-wide text-white">
                        Liên hệ & mạng xã hội
                    </h3>

                    <div className="mt-5 flex gap-3">
                        {socials.map((item, index) => (
                            <a
                                key={index}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="grid h-9 w-9 place-items-center rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
                            >
                                {item.icon}
                            </a>
                        ))}
                    </div>

                    <p className="mt-6 text-sm leading-7 text-slate-400">
                        © {new Date().getFullYear()} THUCTAPGROUP. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
