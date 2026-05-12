﻿import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import fallbackProductImage from '../../assets/Product.png';

const API_URL = 'http://localhost:5000/api';
const SERVER_URL = 'http://localhost:5000';
const PRODUCTS_PER_PAGE = 12;

function getProductImage(product) {
  const image = Array.isArray(product.images) ? product.images[0] : product.image;

  if (!image) return fallbackProductImage;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/')) return `${SERVER_URL}${image}`;

  return `${SERVER_URL}/${image}`;
}

function formatPrice(value) {
  const price = Number(value || 0);

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}

function ProductCard({ product }) {
  const salePrice = Number(product.salePrice || 0);
  const price = Number(product.price || 0);
  const hasSalePrice = salePrice > 0 && salePrice < price;
  const displayPrice = hasSalePrice ? salePrice : price;
  const productUrl = `/products/${product.slug || product._id}`;

  const handleAddToCart = async (e) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    try {
      const res = await fetch(`${API_URL}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 })
      });
      const data = await res.json();
      if (data.success) {
        alert('Đã thêm vào giỏ hàng!');
        window.dispatchEvent(new Event('cart-updated')); // Cập nhật số lượng giỏ hàng trên Header
      } else {
        alert(data.message || 'Lỗi thêm giỏ hàng');
      }
    } catch(err) {
      alert('Lỗi kết nối');
    }
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md text-left shadow-sm ring-1 ring-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-900/10 hover:ring-orange-500/50">
      <Link to={productUrl} className="aspect-[4/3] overflow-hidden bg-slate-100 block">
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </Link>

      <div className="p-5 flex flex-1 flex-col">
        <div className="flex min-h-6 items-center justify-between gap-3">
          <span className="truncate text-xs font-black uppercase tracking-wide text-orange-600">
            {product.category?.name || 'Sản phẩm'}
          </span>
          {product.sku && (
            <span className="shrink-0 rounded bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">
              {product.sku}
            </span>
          )}
        </div>

        <Link to={productUrl} className="mt-3 block">
          <h2 className="line-clamp-2 min-h-[56px] text-xl font-black leading-7 text-slate-950 transition-colors group-hover:text-orange-600">
            {product.name}
          </h2>
        </Link>

        <p className="mt-3 flex-1 line-clamp-2 text-sm font-medium leading-relaxed text-slate-600">
          {product.shortDescription || product.description || 'Thông tin sản phẩm đang được cập nhật.'}
        </p>

        <div className="mt-5 flex min-h-12 items-end justify-between gap-3">
          <div>
            <p className="m-0 text-xl font-black text-slate-950">{formatPrice(displayPrice)}</p>
            {hasSalePrice && (
              <p className="m-0 mt-1 text-sm font-bold text-slate-400 line-through">{formatPrice(price)}</p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="shrink-0 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white transition-all hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/30 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
          </button>
        </div>
      </div>
    </article>
  );
}

function CategoryFilter({ categories, selectedCategory, onChange }) {
  return (
    <div aria-label="Lọc danh mục sản phẩm" className="shrink-0 w-full lg:w-auto">
      <select
        value={selectedCategory}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full lg:w-64 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-black uppercase tracking-wide text-slate-700 outline-none transition hover:border-orange-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
      >
        <option value="">Tất cả danh mục</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const page = Math.max(Number(searchParams.get('page')) || 1, 1);
  const selectedCategory = searchParams.get('category') || '';

  const selectedCategoryName = useMemo(() => {
    if (!selectedCategory) return 'Tất cả sản phẩm';
    return categories.find((category) => category._id === selectedCategory)?.name || 'Danh mục sản phẩm';
  }, [categories, selectedCategory]);

  useEffect(() => {
    let ignore = false;

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories?type=product&isActive=true`);
        const data = await response.json();

        if (!ignore && data.success) {
          setCategories(Array.isArray(data.data) ? data.data : []);
        }
      } catch {
        if (!ignore) setCategories([]);
      }
    };

    fetchCategories();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PRODUCTS_PER_PAGE),
        });
        if (selectedCategory) params.set('category', selectedCategory);

        const response = await fetch(`${API_URL}/products?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Không tải được danh sách sản phẩm');
        }

        setProducts(Array.isArray(data.data) ? data.data : []);
        setPagination(data.pagination || { page, totalPages: 1, total: 0 });
      } catch (err) {
        if (err.name !== 'AbortError') {
          setProducts([]);
          setPagination({ page: 1, totalPages: 1, total: 0 });
          setError('Không tải được danh sách sản phẩm. Vui lòng kiểm tra API.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [page, selectedCategory]);

  const updateFilter = (categoryId) => {
    const nextParams = new URLSearchParams();
    if (categoryId) nextParams.set('category', categoryId);
    setSearchParams(nextParams);
  };

  const updatePage = (nextPage) => {
    const safePage = Math.min(Math.max(nextPage, 1), pagination.totalPages || 1);
    const nextParams = new URLSearchParams(searchParams);

    if (safePage > 1) nextParams.set('page', String(safePage));
    else nextParams.delete('page');

    setSearchParams(nextParams);
  };

  const hasProducts = products.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:20px_20px]">
      <Header variant="compact" />

      <main>
        <section className="border-b border-slate-200/50 bg-white/70 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
            <p className="m-0 text-sm font-black uppercase tracking-[0.16em] text-orange-600">
              THUCTAPGROUP
            </p>
            <h1 className="m-0 mt-3 text-4xl font-black uppercase tracking-wide text-slate-950 md:text-5xl">
              Sản phẩm
            </h1>
          </div>
        </section>

        <section className="mx-auto min-h-[560px] max-w-7xl px-6 py-10 lg:px-10">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="m-0 text-sm font-black uppercase tracking-wide text-slate-500">Danh mục đang xem</p>
              <h2 className="m-0 mt-2 text-2xl font-black text-slate-950">{selectedCategoryName}</h2>
            </div>
            <CategoryFilter categories={categories} selectedCategory={selectedCategory} onChange={updateFilter} />
          </div>

          {loading && (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-[420px] animate-pulse rounded-lg bg-white shadow-sm" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="grid min-h-[360px] place-items-center bg-white text-center">
              <p className="m-0 text-xl font-black text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && !hasProducts && (
            <div className="grid min-h-[360px] place-items-center bg-white text-center">
              <p className="m-0 text-2xl font-black text-slate-900">Không có sản phẩm</p>
            </div>
          )}

          {!loading && !error && hasProducts && (
            <>
              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {products.slice(0, PRODUCTS_PER_PAGE).map((product) => (
                  <ProductCard key={product._id || product.slug} product={product} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => updatePage(page - 1)}
                    disabled={page <= 1}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-black uppercase text-slate-700 transition hover:border-orange-500 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Trước
                  </button>

                  <span className="px-3 text-sm font-black text-slate-700">
                    Trang {pagination.page} / {pagination.totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => updatePage(page + 1)}
                    disabled={page >= pagination.totalPages}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-black uppercase text-slate-700 transition hover:border-orange-500 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
