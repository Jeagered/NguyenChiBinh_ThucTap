import React, { useState, useEffect } from 'react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    type: 'product',
    isActive: true
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setCategories(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch categories');
      }
    } catch (err) {
      setError('An error occurred while fetching categories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      type: category.type || 'product',
      isActive: category.isActive !== undefined ? category.isActive : true
    });
    setEditId(category._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchCategories();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete');
      }
    } catch (err) {
      alert('Error deleting category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `http://localhost:5000/api/categories/${editId}` : 'http://localhost:5000/api/categories';
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
        fetchCategories();
        resetForm();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to save');
      }
    } catch (err) {
      alert('Error saving category');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', type: 'product', isActive: true });
    setEditId(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow"
        >
          Add Category
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded shadow-md border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">{editId ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Slug</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500">
                  <option value="product">Product</option>
                  <option value="news">News</option>
                  <option value="service">Service</option>
                </select>
              </div>
              <div className="flex items-center mt-6">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300 rounded" />
                <label className="ml-2 block text-sm text-slate-900">Active</label>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {categories.map((category) => (
              <tr key={category._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{category.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 capitalize">{category.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(category)} className="text-orange-600 hover:text-orange-900 mr-4">Edit</button>
                  <button onClick={() => handleDelete(category._id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-slate-500">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
