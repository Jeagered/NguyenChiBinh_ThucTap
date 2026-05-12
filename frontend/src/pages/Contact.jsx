import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBackground from '../components/ChatBackground';

const API_URL = 'http://localhost:5000/api';

const formatMessageTime = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  const today = new Date();
  const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  return isToday ? time : `${d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${time}`;
};

export default function Contact() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userStr));
    }
  }, [navigate]);

  const fetchMessages = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/chat`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [user]);

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
        body: JSON.stringify({ content: newMessage })
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
    <div className="flex min-h-screen flex-col bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:20px_20px]">
      <Header variant="compact" />
      
      <main className="flex-1 flex justify-center py-10 px-4">
        <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white flex flex-col h-[70vh]">
          {/* Header Hộp thoại */}
          <div className="bg-orange-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-wide m-0">Hỗ trợ trực tuyến</h2>
            <span className="text-sm bg-orange-600 px-3 py-1 rounded-full">Phản hồi nhanh chóng</span>
          </div>

          {/* Vùng hiển thị tin nhắn */}
          <ChatBackground ref={chatContainerRef} className="p-6 space-y-4">
            {messages.length === 0 ? (
              <p className="text-center text-slate-400 mt-10 text-sm">Hãy gửi tin nhắn để bắt đầu trò chuyện với chúng tôi.</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`px-5 py-3 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-[#dcf8c6] text-slate-800 rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                      <p className="m-0 text-[15px] whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium mb-1 shrink-0">
                      {formatMessageTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </ChatBackground>

          {/* Khung nhập tin nhắn */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 rounded-b-2xl flex gap-3">
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Nhập tin nhắn của bạn..." className="flex-1 border border-slate-300 rounded-full px-5 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition" />
            <button type="submit" disabled={!newMessage.trim()} className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold uppercase tracking-wide hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition">Gửi</button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}