import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import fallbackImage from '../assets/banner1.png';

const API_URL = 'http://localhost:5000/api';
const SERVER_URL = 'http://localhost:5000';

function getImageUrl(image) {
  if (!image) return fallbackImage;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/')) return `${SERVER_URL}${image}`;
  return `${SERVER_URL}/${image}`;
}

// Hàm loại bỏ thẻ HTML để lấy text làm đoạn tóm tắt (excerpt)
const stripHtml = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent || '').replace(/\u00a0/g, ' ').trim();
};

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_URL}/news`);
        const data = await res.json();
        
        if (data.success) {
          // Chỉ lấy các bài viết có trạng thái 'published'
          const published = (data.data || []).filter(item => item.status === 'published');
          setNewsList(published);
        } else {
          setError(data.message || 'Không thể tải danh sách tin tức.');
        }
      } catch {
        setError('Lỗi kết nối đến máy chủ.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:20px_20px]">
      <Header variant="compact" />

      <main className="flex-1">
        {/* Tiêu đề trang */}
        <section className="border-b border-slate-200/50 bg-white/70 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 py-12 text-center lg:px-10">
            <p className="m-0 text-sm font-black uppercase tracking-[0.16em] text-orange-600">
              Cập nhật mới nhất
            </p>
            <h1 className="m-0 mt-3 text-4xl font-black uppercase tracking-wide text-slate-950 md:text-5xl">
              Tin tức & Sự kiện
            </h1>
          </div>
        </section>

        {/* Danh sách Tin tức */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 animate-pulse rounded-xl bg-slate-200 shadow-sm" />
              ))}
            </div>
          ) : error ? (
            <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-red-200 bg-red-50">
              <p className="text-lg font-bold text-red-600">{error}</p>
            </div>
          ) : newsList.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white">
              <p className="text-lg font-bold text-slate-500">Chưa có bài viết nào được xuất bản.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {newsList.map((article) => (
                <Link
                  key={article._id}
                  to={`/news/${article.slug || article._id}`}
                  className="group flex flex-col rounded-xl border border-white bg-white/90 backdrop-blur-md shadow-sm no-underline transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={getImageUrl(article.image)}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="mb-3 break-words text-xl font-black leading-[1.35] text-slate-900 transition-colors group-hover:text-orange-600">
                      {article.title}
                    </h2>
                    <p className="mb-6 flex-1 break-words text-sm font-medium leading-7 text-slate-600">
                      {stripHtml(article.content)}
                    </p>
                    <div className="mt-auto flex items-center text-sm font-black uppercase tracking-wide text-orange-500">
                      Đọc tiếp <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
