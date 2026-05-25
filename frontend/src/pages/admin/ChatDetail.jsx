import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ChatBackground from '../../components/ChatBackground';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SERVER_URL = import.meta.env.VITE_SERVER.URL || 'http://localhost:5000';

const formatMessageTime = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  const today = new Date();
  const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  return isToday ? time : `${d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${time}`;
};

export default function ChatDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName || 'Khách hàng';
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef(null);

  const fetchMessages = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/chat/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newMessage, userId })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gửi tin nhắn không thành công. Vui lòng thử lại.');
      }

      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[80vh]">
      <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50 rounded-t-xl">
        <button onClick={() => navigate('/admin/chats')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 font-bold text-slate-600 transition">
          &larr;
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900 m-0">{userName}</h2>
          <p className="text-xs font-semibold text-emerald-600 m-0">Đang trò chuyện</p>
        </div>
      </div>

      <ChatBackground ref={chatContainerRef} className="p-6 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex w-full ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === 'admin' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${msg.sender === 'admin' ? 'bg-[#dcf8c6] text-slate-800 rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                <p className="m-0 text-[15px] whitespace-pre-wrap">{msg.content}</p>
              </div>
              <span className="text-[11px] text-slate-400 font-medium mb-1 shrink-0">
                {formatMessageTime(msg.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </ChatBackground>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex gap-3">
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={`Trả lời ${userName}...`} className="flex-1 border border-slate-300 rounded-lg px-4 py-2 outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800" />
        <button type="submit" disabled={!newMessage.trim()} className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-wide hover:bg-slate-900 disabled:opacity-50 transition">
          Gửi
        </button>
      </form>
    </div>
  );
}