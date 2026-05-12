import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';

const API_URL = 'http://localhost:5000/api';
const SERVER_URL = 'http://localhost:5000';

function getImageUrl(image, fallback) {
  if (!image) return fallback;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/')) return `${SERVER_URL}${image}`;
  return `${SERVER_URL}/${image}`;
}

const stripHtml = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent || '').replace(/\u00a0/g, ' ').trim();
};

function SectionHeader({ title, to }) {
  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <h2 className="m-0 text-3xl font-black uppercase leading-[1.3] tracking-wide text-slate-900 md:text-4xl">
        {title}
      </h2>
      <Link
        to={to}
        className="group inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl font-black leading-none text-slate-400 no-underline transition-all hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-500/30"
        aria-label={`Xem thêm ${title}`}
      >
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}

function InfoCard({ item, toPrefix, fallbackImage }) {
  const title = item.name || item.title || 'Không có tiêu đề';
  const desc = item.shortDescription || item.description || item.excerpt || stripHtml(item.content) || 'Chưa có mô tả';
  const imageUrl = getImageUrl(Array.isArray(item.images) ? item.images[0] : item.image, fallbackImage);
  const linkTo = `${toPrefix}/${item.slug || item._id || ''}`;

  return (
    <Link
      to={linkTo}
      className="group flex flex-col rounded-xl bg-white/90 backdrop-blur-md text-slate-900 no-underline shadow-sm ring-1 ring-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-900/10 hover:ring-orange-500/50"
    >
      <div className="aspect-[4/3] overflow-hidden rounded-t-xl bg-slate-200">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 text-left">
        <h3 className="m-0 line-clamp-2 break-words text-xl font-black uppercase leading-[1.35] text-slate-900 transition-colors group-hover:text-orange-600">
          {title}
        </h3>
        <p className="mt-3 line-clamp-2 break-words text-sm font-medium leading-7 text-slate-600">
          {desc}
        </p>
        <div className="mt-6 flex items-center text-sm font-black uppercase tracking-wide text-orange-500">
          Xem chi tiết <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">→</span>
        </div>
      </div>
    </Link>
  );
}

function CardSection({ title, to, items, toPrefix, fallbackImage, muted = false, loading = false, emptyMessage = 'Chưa có dữ liệu' }) {
  return (
    <section className={muted ? 'relative overflow-hidden bg-slate-100/50 py-16 md:py-24 backdrop-blur-sm' : 'relative bg-white/70 py-16 md:py-24 backdrop-blur-sm border-y border-white/50'}>
      {muted && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-100/50 to-transparent" />}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeader title={title} to={to} />

        {loading ? (
          <div className="grid gap-7 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[400px] animate-pulse rounded-lg bg-slate-200" />
            ))}
          </div>
        ) : items && items.length > 0 ? (
          <div className="grid gap-7 md:grid-cols-3">
            {items.map((item) => (
              <InfoCard key={item._id || item.slug || item.title} item={item} toPrefix={toPrefix} fallbackImage={fallbackImage} />
            ))}
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white/50">
            <p className="text-lg font-bold text-slate-500">{emptyMessage}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, servicesRes, newsRes] = await Promise.all([
          fetch(`${API_URL}/products?limit=3`).catch(() => null),
          fetch(`${API_URL}/services?limit=3`).catch(() => null),
          fetch(`${API_URL}/news?limit=3`).catch(() => null)
        ]);

        if (productsRes && productsRes.ok) {
          const productsData = await productsRes.json();
          if (productsData.success) setProducts(productsData.data || []);
        }

        if (servicesRes && servicesRes.ok) {
          const servicesData = await servicesRes.json();
          if (servicesData.success) setServices(servicesData.data || []);
        }

        if (newsRes && newsRes.ok) {
          const newsData = await newsRes.json();
          if (newsData.success) setNews(newsData.data || []);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:20px_20px]">
      <Header />
      <main>
        <CardSection
          title="Sản phẩm"
          to="/products"
          toPrefix="/products"
          items={products}
          fallbackImage={banner1}
          loading={loading}
          emptyMessage="Chưa có sản phẩm"
        />
        <CardSection
          title="Dịch vụ"
          to="/services"
          toPrefix="/services"
          items={services}
          fallbackImage={banner2}
          muted
          loading={loading}
          emptyMessage="Chưa có dịch vụ"
        />
        <CardSection
          title="Tin tức"
          to="/news"
          toPrefix="/news"
          items={news}
          fallbackImage={banner1}
          loading={loading}
          emptyMessage="Chưa có tin tức"
        />
      </main>
      <Footer />
    </div>
  );
}
