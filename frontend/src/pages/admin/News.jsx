import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Import CSS của thư viện

const getNewsImage = (image) => {
  if (!image) return 'https://via.placeholder.com/80';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `http://localhost:5000${image.startsWith('/') ? '' : '/'}${image}`;
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

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/news', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setNewsList(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch news');
      }
    } catch (err) {
      setError('An error occurred while fetching news');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleQuillChange = (value) => {
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
      const response = await fetch(`http://localhost:5000/api/news/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchNews();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete');
      }
    } catch (err) {
      alert('Error deleting news');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `http://localhost:5000/api/news/${editId}` : 'http://localhost:5000/api/news';
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
    } catch (err) {
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
        <h1 className="text-2xl font-bold text-slate-800">News</h1>
        {!showForm && (
          <button 
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow"
          >
            Add News
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
                <div className="mt-1 bg-white rounded-md border border-slate-300">
                  <ReactQuill theme="snow" value={formData.content} onChange={handleQuillChange} className="h-64 mb-12" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
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
                    {news.status}
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
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-slate-500">No news found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default News;
