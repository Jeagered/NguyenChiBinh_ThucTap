import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import fallbackProductImage from '../../assets/Product.png';

const API_URL = 'http://localhost:5000/api';
const SERVER_URL = 'http://localhost:5000';

function getProductImage(image) {
  if (!image) return fallbackProductImage;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/')) return `${SERVER_URL}${image}`;
  return `${SERVER_URL}/${image}`;
}

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function ProductDetail() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${idOrSlug}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
          setMainImage(data.data.images?.[0] || data.data.image || '');
        } else {
          setError(data.message || 'Không tìm thấy sản phẩm');
        }
      } catch (err) {
        setError('Lỗi kết nối đến máy chủ');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [idOrSlug]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      const res = await fetch(`${API_URL}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Đã thêm vào giỏ hàng!');
        window.dispatchEvent(new Event('cart-updated')); // Cập nhật Header
      } else {
        alert(data.message || 'Lỗi khi thêm vào giỏ hàng');
      }
    } catch (err) {
      alert('Lỗi kết nối');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header variant="compact" />
        <main className="flex-1 py-12 flex items-center justify-center">
          <p className="text-xl font-medium text-slate-500">Đang tải thông tin sản phẩm...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header variant="compact" />
        <main className="flex-1 py-12 flex items-center justify-center">
          <p className="text-xl font-medium text-red-500">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const salePrice = Number(product.salePrice || 0);
  const price = Number(product.price || 0);
  const hasSalePrice = salePrice > 0 && salePrice < price;
  const displayPrice = hasSalePrice ? salePrice : price;
  const allImages = Array.isArray(product.images) && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:20px_20px]">
      <Header variant="compact" />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 xl:gap-x-16">
            {/* Phần Hình Ảnh */}
            <div className="flex flex-col">
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md border border-white shadow-sm flex items-center justify-center p-4">
                <img src={getProductImage(mainImage)} alt={product.name} className="h-full w-full object-contain object-center sm:rounded-lg" />
              </div>
              <div className="mt-4 w-full">
                <div className="flex gap-4 overflow-x-auto pb-2" aria-orientation="horizontal" role="tablist">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      className="relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm text-sm font-medium hover:bg-white focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-2 shadow-sm border border-white"
                      onClick={() => setMainImage(img)}
                    >
                      <span className="absolute inset-0 overflow-hidden rounded-xl">
                        <img src={getProductImage(img)} alt="" className="h-full w-full object-cover object-center" />
                      </span>
                      <span
                        className={`pointer-events-none absolute inset-0 rounded-xl ring-2 ring-offset-2 ${mainImage === img ? 'ring-orange-500' : 'ring-transparent'}`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Phần Thông Tin */}
            <div className="mt-10 px-4 sm:px-0 lg:mt-0">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">{product.name}</h1>
              <div className="mt-3">
                <p className="text-3xl font-black tracking-tight text-orange-600">{formatPrice(displayPrice)}</p>
                {hasSalePrice && <p className="mt-1 text-lg font-bold text-slate-400 line-through">{formatPrice(price)}</p>}
              </div>
              <div className="mt-8 flex gap-4">
                <div className="flex items-center border border-slate-300 rounded-md">
                  <button type="button" className="px-4 py-2 text-slate-600 hover:text-orange-500 font-bold" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <span className="px-4 font-bold text-slate-900">{quantity}</span>
                  <button type="button" className="px-4 py-2 text-slate-600 hover:text-orange-500 font-bold" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
                <button type="button" onClick={handleAddToCart} disabled={addingToCart || product.stock === 0} className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-orange-600 px-8 py-3 text-base font-black text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-50 sm:w-full transition disabled:bg-slate-400 uppercase tracking-wide">
                  {addingToCart ? 'Đang thêm...' : (product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng')}
                </button>
              </div>
              <div className="mt-8 border-t border-slate-200 pt-8">
                <h2 className="text-sm font-black text-slate-900 uppercase">Thông tin thêm</h2>
                <div className="mt-4 prose prose-sm text-slate-500 max-w-none">
                  <ul role="list" className="space-y-2">
                    <li>Danh mục: <span className="font-semibold text-slate-700">{product.category?.name}</span></li>
                    {product.sku && <li>SKU: <span className="font-semibold text-slate-700">{product.sku}</span></li>}
                  </ul>
                  <div className="mt-6 pt-6 border-t border-slate-100 text-base text-slate-700 leading-relaxed whitespace-pre-line">
                    <h3 className="text-sm font-bold text-slate-900 uppercase mb-3">Mô tả sản phẩm</h3>
                    <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-6 shadow-sm">
                      <p className="break-words m-0">{product.description || product.shortDescription || 'Chưa có mô tả.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}