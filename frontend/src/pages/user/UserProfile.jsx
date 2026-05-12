﻿﻿﻿﻿﻿import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { PASSWORD_REQUIREMENT_MESSAGE, isValidPassword } from '../../utils/passwordPolicy';

const API_URL = 'http://localhost:5000/api';

const emptyAddress = {
  fullName: '',
  phone: '',
  province: '',
  district: '',
  ward: '',
  street: '',
  isDefault: true,
};

function TextField({ label, value, onChange, type = 'text', disabled = false, required = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black uppercase tracking-wide text-slate-700">{label}</span>
      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className="h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-base font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15 disabled:bg-slate-100 disabled:text-slate-500"
      />
    </label>
  );
}

export default function UserProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [address, setAddress] = useState(emptyAddress);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Đẩy về trang đăng nhập nếu tài khoản bị khóa
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('auth-updated'));
          navigate('/login');
          return;
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Không lấy được thông tin tài khoản');
        }

        setProfile(data.data);
        setAddress(data.data.addresses?.[0] || emptyAddress);
        localStorage.setItem('user', JSON.stringify(data.data));
        window.dispatchEvent(new Event('auth-updated'));
      } catch (err) {
        setError(err.message || 'Không lấy được thông tin tài khoản');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, token]);

  // Tự động xóa thông báo sau 3 giây
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const updateProfileField = (field) => (event) => {
    setProfile((current) => ({ ...current, [field]: event.target.value }));
  };

  const updateAddressField = (field) => (event) => {
    setAddress((current) => ({ ...current, [field]: event.target.value }));
  };

  const updatePasswordField = (field) => (event) => {
    setPasswords((current) => ({ ...current, [field]: event.target.value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          avatar: profile.avatar,
          addresses: [address],
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Cập nhật thông tin không thành công');
      }

      setProfile(data.data);
      setAddress(data.data.addresses?.[0] || emptyAddress);
      localStorage.setItem('user', JSON.stringify(data.data));
      window.dispatchEvent(new Event('auth-updated'));
      setMessage('Cập nhật thông tin cá nhân thành công');
    } catch (err) {
      setError(err.message || 'Cập nhật thông tin không thành công');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (!isValidPassword(passwords.newPassword)) {
      setError(PASSWORD_REQUIREMENT_MESSAGE);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Đổi mật khẩu không thành công');
      }

      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage('Đổi mật khẩu thành công');
    } catch (err) {
      setError(err.message || 'Đổi mật khẩu không thành công');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-updated'));
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header variant="compact" />
        <main className="grid min-h-[520px] place-items-center bg-slate-50 px-6 text-lg font-black text-slate-700">
          Đang tải thông tin tài khoản...
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header variant="compact" />
      <main className="bg-slate-50 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              <img
                src={profile?.avatar || `https://ui-avatars.com/api/?name=${profile?.name}&background=random`}
                alt={profile?.name}
                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div>
                <p className="m-0 text-sm font-black uppercase tracking-[0.2em] text-orange-600">Tài khoản</p>
                <h1 className="m-0 mt-2 text-4xl font-black uppercase tracking-wide text-slate-950">{profile?.name}</h1>
              </div>
            </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/my-orders"
              className="flex h-11 items-center rounded-md bg-slate-900 px-5 text-sm font-black uppercase tracking-wide text-white transition hover:bg-orange-500"
            >
              Đơn hàng của tôi
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex h-11 items-center rounded-md border border-slate-300 bg-white px-5 text-sm font-black uppercase tracking-wide text-slate-700 transition hover:border-orange-500 hover:text-orange-600"
            >
              Đăng xuất
            </button>
          </div>
          </div>

          {(message || error) && (
            <div className={message ? 'mb-6 rounded-md bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700' : 'mb-6 rounded-md bg-red-50 px-5 py-4 text-sm font-bold text-red-700'}>
              {message || error}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <form onSubmit={saveProfile} className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
              <h2 className="m-0 mb-6 text-2xl font-black uppercase text-slate-900">Hồ sơ của tôi</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <TextField label="Họ và tên" value={profile?.name} onChange={updateProfileField('name')} required />
                <TextField label="Email" type="email" value={profile?.email} onChange={updateProfileField('email')} required />
                <TextField label="Số điện thoại" value={profile?.phone} onChange={updateProfileField('phone')} />
                <TextField label="Ảnh đại diện URL" value={profile?.avatar} onChange={updateProfileField('avatar')} />
                <TextField label="Quyền tài khoản" value={profile?.role} disabled />
              </div>

              <h3 className="m-0 mt-9 mb-5 text-xl font-black uppercase text-slate-900">Địa chỉ mặc định</h3>
              <div className="grid gap-5 md:grid-cols-2">
                <TextField label="Tên người nhận" value={address.fullName} onChange={updateAddressField('fullName')} />
                <TextField label="Số điện thoại nhận hàng" value={address.phone} onChange={updateAddressField('phone')} />
                <div className="md:col-span-2">
                  <TextField label="Địa chỉ đầy đủ (Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/TP)" value={address.street} onChange={updateAddressField('street')} />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-8 h-12 rounded-md bg-orange-500 px-7 text-sm font-black uppercase tracking-wide text-white transition hover:bg-orange-600 disabled:bg-slate-400"
              >
                {saving ? 'Đang lưu...' : 'Lưu thông tin'}
              </button>
            </form>

            <form onSubmit={changePassword} className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
              <h2 className="m-0 mb-6 text-2xl font-black uppercase text-slate-900">Đổi mật khẩu</h2>
              <div className="space-y-5">
                <TextField label="Mật khẩu hiện tại" type="password" value={passwords.currentPassword} onChange={updatePasswordField('currentPassword')} />
                <TextField label="Mật khẩu mới" type="password" value={passwords.newPassword} onChange={updatePasswordField('newPassword')} />
                <p className="-mt-3 text-xs font-semibold leading-5 text-slate-500">
                  Mật khẩu 6-20 ký tự, gồm chữ, số và ký tự đặc biệt.
                </p>
                <TextField label="Xác nhận mật khẩu mới" type="password" value={passwords.confirmPassword} onChange={updatePasswordField('confirmPassword')} />
              </div>
              <button
                type="submit"
                className="mt-8 h-12 rounded-md bg-slate-950 px-7 text-sm font-black uppercase tracking-wide text-white transition hover:bg-orange-600"
              >
                Đổi mật khẩu
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
