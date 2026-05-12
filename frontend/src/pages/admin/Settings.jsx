import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    siteName: '',
    hotline: '',
    email: '',
    address: '',
    facebook: '',
    youtube: '',
    zalo: '',
    seoTitle: '',
    seoDescription: '',
    aboutTitle: '',
    aboutContent: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch(`${API_URL}/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (data.success && data.data) {
          setSettings((prev) => ({ ...prev, ...data.data }));
        }
      } catch (err) {
        console.error('Lỗi khi tải cài đặt:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage('Lưu cài đặt thành công!');
      } else {
        setMessage(data.message || 'Lỗi khi lưu cài đặt');
      }
    } catch (err) {
      setMessage('Lỗi kết nối khi lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Đang tải cài đặt...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Cài đặt hệ thống</h2>
      
      {message && (
        <div className={`mb-6 p-4 rounded-md font-bold text-sm ${message.includes('thành công') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tên trang web</label>
            <input type="text" name="siteName" value={settings.siteName || ''} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Hotline</label>
            <input type="text" name="hotline" value={settings.hotline || ''} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email liên hệ</label>
            <input type="email" name="email" value={settings.email || ''} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Địa chỉ</label>
            <input type="text" name="address" value={settings.address || ''} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Facebook</label>
            <input type="text" name="facebook" value={settings.facebook || ''} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Zalo</label>
            <input type="text" name="zalo" value={settings.zalo || ''} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Giới thiệu (Tiêu đề)</label>
            <input type="text" name="aboutTitle" value={settings.aboutTitle || ''} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Giới thiệu (Nội dung)</label>
            <textarea name="aboutContent" rows="4" value={settings.aboutContent || ''} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button type="submit" disabled={saving} className="bg-orange-500 text-white px-6 py-3 rounded-md font-bold hover:bg-orange-600 transition disabled:opacity-50">
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}
