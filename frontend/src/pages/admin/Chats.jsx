import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const formatTime = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  const today = new Date();
  const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  if (isToday) return time;
  return `${d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${time}`;
};

export default function Chats() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setConversations(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">Quản lý tin nhắn</h2>
        <p className="text-slate-500 mt-1">Danh sách khách hàng đang liên hệ</p>
      </div>

      {loading ? (
        <p className="text-slate-500">Đang tải...</p>
      ) : conversations.length === 0 ? (
        <div className="py-10 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
          Chưa có hộp thoại tin nhắn nào.
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <div 
              key={conv.userId} 
              onClick={() => navigate(`/admin/chats/${conv.userId}`, { state: { userName: conv.userName } })}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-orange-50 hover:border-orange-200 cursor-pointer transition group"
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <img 
                  src={conv.userAvatar || `https://ui-avatars.com/api/?name=${conv.userName || 'User'}&background=random`} 
                  alt={conv.userName} 
                  className="h-12 w-12 shrink-0 rounded-full object-cover border border-slate-200 shadow-sm group-hover:border-orange-300 transition"
                />
                <div className="truncate">
                  <h3 className="font-bold text-slate-900 truncate text-lg">{conv.userName}</h3>
                  <p className="text-slate-500 text-sm truncate mt-0.5">{conv.lastMessage}</p>
                </div>
              </div>
              <div className="text-sm font-semibold text-slate-400 shrink-0 ml-4 flex flex-col items-end gap-1.5">
                <span className="group-hover:text-orange-500 transition-colors">{formatTime(conv.lastMessageAt)}</span>
                {conv.unreadCount > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white shadow-sm">
                    {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}