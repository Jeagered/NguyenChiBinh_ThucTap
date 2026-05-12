import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    image: '',
    content: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setServices(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch services');
      }
    } catch (err) {
      setError('An error occurred while fetching services');
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

  const handleEdit = (service) => {
    setFormData({
      title: service.title,
      slug: service.slug,
      summary: service.summary || '',
      image: service.image || '',
      content: service.content || ''
    });
    setEditId(service._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchServices();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete');
      }
    } catch (err) {
      alert('Error deleting service');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `http://localhost:5000/api/services/${editId}` : 'http://localhost:5000/api/services';
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
        fetchServices();
        resetForm();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to save');
      }
    } catch (err) {
      alert('Error saving service');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', slug: '', summary: '', image: '', content: '' });
    setEditId(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dịch Vụ</h1>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow"
        >
          Thêm Dịch Vụ
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded shadow-md border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">{editId ? 'Edit Service' : 'Add Service'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Mô tả</label>
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
                <label className="block text-sm font-medium text-slate-700">Summary</label>
                <textarea name="summary" value={formData.summary} onChange={handleInputChange} rows="3" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500"></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Mô tả chi tiết</label>
                <div className="mt-1 bg-white rounded-md border border-slate-300">
                  <ReactQuill theme="snow" value={formData.content} onChange={handleQuillChange} className="h-64 mb-12" />
                </div>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {services.map((service) => (
              <tr key={service._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{service.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{service.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/services/${service.slug || service._id}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 mr-4">View</Link>
                  <button onClick={() => handleEdit(service)} className="text-orange-600 hover:text-orange-900 mr-4">Edit</button>
                  <button onClick={() => handleDelete(service._id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-slate-500">No services found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;
