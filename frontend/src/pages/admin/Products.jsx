import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const getProductImage = (images) => {
  if (!images || images.length === 0 || !images[0]) return 'https://via.placeholder.com/80';
  const image = images[0];
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${SERVER_URL}${image.startsWith('/') ? '' : '/'}${image}`;
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    price: '',
    salePrice: '',
    stock: 0,
    category: '',
    images: '',
    shortDescription: '',
    description: '',
    isFeatured: false,
    isActive: true
  });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products?page=${page}&limit=10&admin=true`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data.data || []);
        if (data.pagination) setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      // Tự động tạo hoặc xóa SKU tùy thuộc vào việc có chọn danh mục hay không
      if (name === 'category') {
        if (value && !prev.sku) {
          const category = categories.find(cat => cat._id === value);
          if (category && category.name) {
            const normalizedName = category.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
            const initials = normalizedName.split(' ').filter(w => w).map(w => w[0].toUpperCase()).join('');
            const randomSuffix = Math.floor(1000 + Math.random() * 9000);
            updatedData.sku = `${initials}${randomSuffix}`;
          }
        } else if (!value) {
          // Nếu danh mục bị bỏ trống, reset lại SKU
          updatedData.sku = '';
        }
      }
      
      return updatedData;
    });
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      sku: product.sku || '',
      price: product.price || '',
      salePrice: product.salePrice || '',
      stock: product.stock !== undefined ? product.stock : 0,
      category: product.category ? (product.category._id || product.category) : '',
      images: product.images ? product.images.join(', ') : '',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      isFeatured: product.isFeatured || false,
      isActive: product.isActive !== undefined ? product.isActive : true
    });
    setEditId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchProducts();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete');
      }
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `${API_URL}/products/${editId}` : `${API_URL}/products`;
    const method = editId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          ...formData, 
          price: Number(formData.price),
          salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
          stock: Number(formData.stock),
          images: formData.images ? formData.images.split(',').map(img => img.trim()).filter(Boolean) : []
        })
      });
      if (response.ok) {
        fetchProducts();
        resetForm();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to save');
      }
    } catch (err) {
      alert('Error saving product');
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', slug: '', sku: '', price: '', salePrice: '', stock: 0, 
      category: '', images: '', shortDescription: '', description: '', 
      isFeatured: false, isActive: true 
    });
    setEditId(null);
    setShowForm(false);
  };

  const getCategoryName = (categoryId) => {
    if (typeof categoryId === 'object' && categoryId?.name) return categoryId.name;
    const cat = categories.find(c => c._id === categoryId);
    return cat ? cat.name : 'Unknown';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Sản Phẩm</h1>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow"
        >
          Thêm sản phẩm mới
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded shadow-md border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">{editId ? 'Edit Product' : 'Add Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Tên</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Slug</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">SKU (Mã SP)</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Giá</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Sale (Giá KM)</label>
                <input type="number" name="salePrice" value={formData.salePrice} onChange={handleInputChange} min="0" step="0.01" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Stock (Số lượng)</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Danh mục</label>
                <select name="category" value={formData.category} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500">
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Hình ảnh (URL, cách nhau bằng dấu phẩy)</label>
            <input type="text" name="images" value={formData.images} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500" placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Mô tả ngắn</label>
                <textarea name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} rows="2" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500"></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Mô tả</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:border-orange-500 focus:ring-orange-500"></textarea>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <label className="flex items-center">
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                  <span className="ml-2 text-sm text-gray-700">Nổi bật</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                  <span className="ml-2 text-sm text-gray-700">Hiển thị (Active)</span>
                </label>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img 
                      src={getProductImage(product.images)} 
                      alt={product.name} 
                      className="w-10 h-10 rounded-md object-cover border border-slate-200 shadow-sm shrink-0"
                    />
                    <span className="text-sm font-semibold text-slate-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-semibold">{formatPrice(product.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{getCategoryName(product.category)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {product.stock > 0 ? (
                    <span className="text-slate-700 font-medium">{product.stock}</span>
                  ) : (
                    <span className="text-red-600 font-bold">Hết hàng (0)</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/products/${product.slug || product._id}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 mr-4">View</Link>
                  <button onClick={() => handleEdit(product)} className="text-orange-600 hover:text-orange-900 mr-4">Edit</button>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-slate-500">Không có sản phẩm nào.</td>
              </tr>
            )}
          </tbody>
        </table>

        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200 bg-slate-50">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-slate-300 rounded-md text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Trước
            </button>
            <span className="text-sm font-medium text-slate-700">
              Trang {page} / {pagination.totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="px-4 py-2 border border-slate-300 rounded-md text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
