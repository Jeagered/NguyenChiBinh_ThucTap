import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PASSWORD_REQUIREMENT_MESSAGE, isValidPassword } from '../../utils/passwordPolicy';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); 
  const [modalData, setModalData] = useState({ name: '', email: '', password: '', role: 'user' });

  // State cho bộ lọc
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.message || 'Không thể tải danh sách người dùng');
      }
    } catch (err) {
      setError('Lỗi kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setModalData({ ...user, password: '' }); // Không hiển thị mật khẩu cũ
    } else {
      setEditingUser(null);
      setModalData({ name: '', email: '', password: '', role: 'user' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleModalChange = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingUser ? 'PUT' : 'POST';
    const url = editingUser ? `${API_URL}/users/${editingUser._id}` : `${API_URL}/users`;

    const payload = { ...modalData };
    if (editingUser && !payload.password) {
      delete payload.password; // Không gửi mật khẩu nếu không thay đổi
    }

    if (payload.password && !isValidPassword(payload.password)) {
      alert(PASSWORD_REQUIREMENT_MESSAGE);
      return;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
        closeModal();
      } else {
        alert(`Lỗi: ${data.message}` || 'Lưu không thành công');
      }
    } catch (err) {
      alert('Lỗi kết nối: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này? Thao tác này không thể hoàn tác.')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(`Lỗi: ${data.message}` || 'Xóa người dùng không thành công');
      }
    } catch (err) {
      alert('Lỗi kết nối khi xóa người dùng');
    }
  };

  const handleToggleBlock = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái người dùng này?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users/${userId}/block`, {
        method: 'PATCH', // Lưu ý: Thử đổi thành 'PUT' nếu backend của bạn được cấu hình bằng app.put()
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }
      });
      
      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        // Nếu backend Render trả về 404 HTML hoặc 500 HTML
        throw new Error(`Máy chủ trả về phản hồi không hợp lệ (Mã lỗi: ${res.status} ${res.statusText})`);
      }
      
      if (res.ok && data.success) {
        // Cập nhật lại danh sách sau khi đổi trạng thái
        fetchUsers();
      } else {
        alert(data.message || `Lỗi khi cập nhật trạng thái: ${res.status}`);
      }
    } catch (err) {
      console.error("Lỗi toggle block:", err);
      alert('Lỗi kết nối khi cập nhật trạng thái: ' + err.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchRole = roleFilter === 'all' || user.role === roleFilter;
    const matchStatus = statusFilter === 'all' || (statusFilter === 'blocked' ? user.isBlocked : !user.isBlocked);
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = (user.name && user.name.toLowerCase().includes(searchLower)) ||
                        (user.username && user.username.toLowerCase().includes(searchLower)) ||
                        (user.email && user.email.toLowerCase().includes(searchLower));
    return matchRole && matchStatus && matchSearch;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">Quản lý người dùng</h2>
        <button 
          onClick={() => openModal()}
          className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold text-sm uppercase tracking-wide hover:bg-orange-600 transition"
        >
          Thêm người dùng mới
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-md bg-red-50 text-red-700 text-sm font-bold">
          {error}
        </div>
      )}

      {/* Thanh công cụ tìm kiếm và lọc */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Tìm kiếm tên, email..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border border-slate-300 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
        />
        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 border border-slate-300 rounded-md bg-white focus:border-orange-500 outline-none transition"
        >
          <option value="all">Tất cả quyền</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border border-slate-300 rounded-md bg-white focus:border-orange-500 outline-none transition"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="blocked">Đã chặn</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-slate-500 font-medium">Đang tải danh sách người dùng...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-sm uppercase tracking-wide text-slate-500 bg-slate-50">
                <th className="py-3 px-4">Tên</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Quyền</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name || user.username || 'User'}&background=random`} 
                        alt={user.name || user.username || 'User'} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                      />
                      <span className="font-semibold text-slate-800">{user.name || user.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{user.email}</td>
                  <td className="py-3 px-4">
                    {user.role === 'admin' ? (
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">Admin</span>
                    ) : (
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">User</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {user.isBlocked ? (
                      <span className="text-red-600 font-bold text-sm uppercase tracking-wide">Đã chặn</span>
                    ) : (
                      <span className="text-emerald-600 font-bold text-sm uppercase tracking-wide">Hoạt động</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-3">
                    <button onClick={() => openModal(user)} className="text-blue-600 hover:text-blue-800 font-bold text-sm uppercase tracking-wide">Sửa</button>
                    <button 
                      onClick={() => handleToggleBlock(user._id)}
                      className={`${user.isBlocked ? 'text-emerald-600 hover:text-emerald-800' : 'text-yellow-600 hover:text-yellow-800'} font-bold text-sm uppercase tracking-wide`}
                    >
                      {user.isBlocked ? 'Bỏ chặn' : 'Chặn'}
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-800 font-bold text-sm uppercase tracking-wide"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 font-medium">Không có người dùng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Create/Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">{editingUser ? 'Sửa thông tin người dùng' : 'Tạo người dùng mới'}</h3>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Tên</label>
                <input type="text" name="name" value={modalData.name} onChange={handleModalChange} className="w-full p-2 border border-slate-300 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Email</label>
                <input type="email" name="email" value={modalData.email} onChange={handleModalChange} className="w-full p-2 border border-slate-300 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Mật khẩu</label>
                <input type="password" name="password" value={modalData.password} onChange={handleModalChange} placeholder={editingUser ? 'Để trống nếu không đổi' : ''} className="w-full p-2 border border-slate-300 rounded-md" required={!editingUser} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Quyền</label>
                <select name="role" value={modalData.role} onChange={handleModalChange} className="w-full p-2 border border-slate-300 rounded-md bg-white">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-4 py-2 rounded-md bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-600"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
