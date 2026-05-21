import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RichTextEditor from '../../components/RichTextEditor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const getNewsImage = (image) => {
  if (!image) return 'https://via.placeholder.com/80';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${SERVER_URL}${image.startsWith('/') ? '' : '/'}${image}`;
};

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'draft',
    image: ''
  });

  const token = localStorage.getItem('token');

  const fetchNews = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/news`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setNewsList(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch news');
      }
    } catch {
      setError('An error occurred while fetching news');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timer = window.setTimeout(fetchNews, 0);
    return () => window.clearTimeout(timer);
  }, [fetchNews]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditorChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleEdit = (news) => {
    setFormData({
      title: news.title,
      slug: news.slug,
      content: news.content,
      status: news.status || 'draft',
      image: news.image || ''
    });
    setEditId(news._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) return;
    try {
      const response = await fetch(`${API_URL}/news/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchNews();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete');
      }
    } catch {
      alert('Error deleting news');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `${API_URL}/news/${editId}` : `${API_URL}/news`;
    const method = editId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchNews();
        resetForm();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to save');
      }
    } catch {
      alert('Error saving news');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', slug: '', content: '', status: 'draft', image: '' });
    setEditId(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Tin Tức</h1>
        {!showForm && (
          <button 
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow"
          >
            Thêm Tin Tức
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded shadow-md border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">{editId ? 'Edit News' : 'Add News'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Slug</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500" />
              </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Hình ảnh (URL)</label>
            <input type="text" name="image" value={formData.image} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500" placeholder="https://example.com/image.jpg" />
          </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Content</label>
                <div className="mt-1">
                  <RichTextEditor
                    value={formData.content}
                    onChange={handleEditorChange}
                    placeholder="Nhap noi dung tin tuc..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500">
                  <option value="draft">Nháp</option>
                  <option value="published">Đã xuất bản</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {newsList.map((news) => (
              <tr key={news._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img 
                      src={getNewsImage(news.image)} 
                      alt={news.title} 
                      className="w-10 h-10 rounded-md object-cover border border-slate-200 shadow-sm shrink-0"
                    />
                    <span className="text-sm font-semibold text-slate-900">{news.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${news.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {news.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/news/${news.slug || news._id}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 mr-4">View</Link>
                  <button onClick={() => handleEdit(news)} className="text-orange-600 hover:text-orange-900 mr-4">Edit</button>
                  <button onClick={() => handleDelete(news._id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
            {newsList.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-slate-500">Không có tin tức nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default News;
