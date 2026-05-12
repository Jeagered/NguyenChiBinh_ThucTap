import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const API_URL = 'http://localhost:5000/api';
const SERVER_URL = 'http://localhost:5000';

function getProductImage(image) {
  if (!image) return 'https://via.placeholder.com/150';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/')) return `${SERVER_URL}${image}`;
  return `${SERVER_URL}/${image}`;
}

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          setCartItems(data.data.items || []);
        } else {
          setError(data.message || 'Không thể tải giỏ hàng');
        }
      } catch (err) {
        setError('Lỗi kết nối đến máy chủ');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCart();
  }, [navigate]);

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleRemove = async (productId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/cart/items/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setCartItems(data.data.items || []);
        // Update header cart count event if necessary
        window.dispatchEvent(new Event('cart-updated'));
      } else {
        alert(data.message || 'Xóa sản phẩm thất bại');
      }
    } catch (err) {
      alert('Lỗi kết nối khi xóa sản phẩm');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header variant="compact" />
        <main className="flex-1 py-12 flex items-center justify-center">
          <p className="text-xl font-medium text-slate-500">Đang tải giỏ hàng...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header variant="compact" />
        <main className="flex-1 py-12 flex items-center justify-center text-center">
          <div>
            <p className="text-xl font-medium text-red-500 mb-4">{error}</p>
            <Link to="/products" className="text-orange-600 hover:underline">Quay lại mua sắm</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header variant="compact" />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-slate-900">Giỏ hàng của bạn</h1>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Cart Items List */}
              <div className="lg:col-span-8">
                <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200">
                  <ul className="divide-y divide-slate-200">
                    {cartItems.map((item) => (
                      <li key={item.product} className="flex px-6 py-6 sm:px-8">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                          <img
                            src={getProductImage(item.image)}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-slate-900">
                              <h3>{item.name}</h3>
                              <p className="ml-4">{item.price.toLocaleString('vi-VN')} ₫</p>
                            </div>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <p className="text-slate-500">Số lượng: {item.quantity}</p>

                            <div className="flex">
                              <button
                                type="button"
                                onClick={() => handleRemove(item.product)}
                                className="font-medium text-orange-600 hover:text-orange-500"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4">
                <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
                  <h2 className="text-lg font-medium text-slate-900">Tóm tắt đơn hàng</h2>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                      <dt className="text-base font-medium text-slate-900">Tổng cộng</dt>
                      <dd className="text-base font-medium text-slate-900">
                        {totalAmount.toLocaleString('vi-VN')} ₫
                      </dd>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleCheckout}
                      className="w-full rounded-md border border-transparent bg-orange-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-50 transition"
                    >
                      Tiến hành đặt hàng
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-slate-500">
                    <p>
                      hoặc{' '}
                      <Link to="/products" className="font-medium text-orange-600 hover:text-orange-500">
                        Tiếp tục mua sắm
                        <span aria-hidden="true"> &rarr;</span>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-medium text-slate-900 mb-4">Giỏ hàng trống</h2>
              <p className="text-slate-500 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
              <Link
                to="/products"
                className="inline-flex items-center rounded-md bg-orange-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
