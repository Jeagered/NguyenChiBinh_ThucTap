﻿import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import banner2 from '../../assets/banner2.png';
import { PASSWORD_REQUIREMENT_MESSAGE, isValidPassword } from '../../utils/passwordPolicy';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Field({ label, type = 'text', value, onChange, autoComplete }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={label}
        className="h-14 w-full rounded-md border border-slate-300 bg-white px-5 text-base font-semibold text-slate-800 outline-none transition placeholder:text-slate-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
      />
    </label>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [accepted, setAccepted] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (form.password !== form.confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp');
      return;
    }

    if (!isValidPassword(form.password)) {
      setMessage(PASSWORD_REQUIREMENT_MESSAGE);
      return;
    }

    if (!accepted) {
      setMessage('Bạn cần đồng ý với điều khoản trước khi đăng ký');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name || form.username,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        setMessage(data.message || 'Đăng ký không thành công');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      window.dispatchEvent(new Event('auth-updated'));
      window.alert('Đăng ký tài khoản thành công');
      navigate('/');
    } catch {
      setMessage('Không kết nối được máy chủ. Vui lòng kiểm tra backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header variant="compact" />
      <main className="relative grid min-h-[860px] place-items-center overflow-hidden bg-slate-50 px-6 py-20">
        <div
          className="absolute inset-y-0 right-0 hidden w-1/2 bg-contain bg-center bg-no-repeat opacity-10 lg:block"
          style={{ backgroundImage: `url(${banner2})` }}
          aria-hidden="true"
        />
        <section className="relative z-10 w-full max-w-[560px] rounded-lg border border-slate-200 bg-white/95 px-8 py-10 text-center shadow-2xl shadow-slate-900/15 md:px-11">
          <div className="mx-auto mb-7 flex items-center justify-center gap-3 text-slate-900">
            <span className="grid h-12 w-12 place-items-center rounded-lg border-2 border-orange-500 text-sm font-black text-orange-500">TTG</span>
            <span className="text-xl font-black">THUCTAPGROUP</span>
          </div>

          <h1 className="m-0 text-4xl font-black uppercase tracking-wide text-slate-950">Đăng ký</h1>
          <p className="mx-auto mt-3 max-w-sm text-base font-semibold leading-7 text-slate-700">
            Vui lòng điền thông tin để tạo tài khoản THUCTAPGROUP mới.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left">
            <Field label="Họ và tên" value={form.name} onChange={updateField('name')} autoComplete="name" />
            <Field label="Địa chỉ Email" type="email" value={form.email} onChange={updateField('email')} autoComplete="email" />
            <Field label="Tên người dùng mong muốn" value={form.username} onChange={updateField('username')} autoComplete="username" />
            <Field label="Mật khẩu" type="password" value={form.password} onChange={updateField('password')} autoComplete="new-password" />
            <p className="-mt-3 text-xs font-semibold leading-5 text-slate-500">
              Mật khẩu 6-20 ký tự, gồm chữ, số và ký tự đặc biệt.
            </p>
            <Field label="Xác nhận mật khẩu" type="password" value={form.confirmPassword} onChange={updateField('confirmPassword')} autoComplete="new-password" />

            <label className="flex items-center gap-3 text-base font-bold text-slate-800">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                className="h-5 w-5 rounded border-slate-300 accent-orange-500"
              />
              <span>
                Tôi đồng ý với <span className="text-orange-600">Điều khoản & Điều kiện</span>
              </span>
            </label>

            {message && <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-md bg-orange-500 text-base font-black uppercase tracking-wide text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          <p className="mt-6 text-base font-semibold text-slate-900">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-black text-orange-600 no-underline hover:text-orange-700">
              Đăng nhập ngay
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
