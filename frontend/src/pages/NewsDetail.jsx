import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

import fallbackImage from '../assets/banner1.png';
import 'react-quill-new/dist/quill.snow.css'; // Import CSS gốc của Quill
// import '../news-detail.css'; // File này không còn cần thiết

const API_URL = 'http://localhost:5000/api';
const SERVER_URL = 'http://localhost:5000';

function getImageUrl(image) {
  if (!image) return fallbackImage;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/')) return `${SERVER_URL}${image}`;
  return `${SERVER_URL}/${image}`;
}

// Hàm "làm sạch" HTML bằng cách loại bỏ tất cả các thuộc tính style inline.
// Đây là giải pháp triệt để nhất để chống lại lỗi hiển thị do nội dung được copy/paste từ bên ngoài.
const sanitizeContent = (html) => {
  if (!html) return '';
  // Dùng regex để tìm và thay thế tất cả các 'style="..."' bằng một chuỗi rỗng.
  return html.replace(/style="[^"]*"/g, '');
};

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Lấy danh sách rồi lọc ra giống ServiceDetail để tránh lỗi khi backend thiếu API get by ID
        const res = await fetch(`${API_URL}/news`);
        const data = await res.json();
        
        if (data.success) {
          const found = data.data.find(n => n._id === id || n.slug === id);
          if (found) {
            setArticle(found);
          } else {
            setError('Không tìm thấy bài viết.');
          }
        } else {
          setError(data.message || 'Lỗi khi tải dữ liệu bài viết.');
        }
      } catch (err) {
        setError('Lỗi kết nối đến máy chủ.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header variant="compact" />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-xl font-medium text-slate-500 animate-pulse">Đang tải bài viết...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header variant="compact" />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-xl font-bold text-red-600">{error}</p>
            <Link to="/news" className="text-orange-600 font-bold hover:text-orange-700 transition">
              &larr; Quay lại danh sách tin tức
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:20px_20px]">
      <Header variant="compact" />

      <main className="flex-1 py-12 lg:py-20">
        <article className="mx-auto max-w-4xl px-6 lg:px-10">
          <Link to="/news" className="mb-8 inline-block text-sm font-bold text-orange-600 hover:text-orange-700 transition">
            &larr; Tất cả tin tức
          </Link>
          
          <h1 className="mb-6 text-3xl font-black leading-tight text-slate-900 md:text-5xl">
            {article.title}
          </h1>

          <div className="mb-10 overflow-hidden rounded-2xl border border-white bg-white/50 p-2 shadow-sm backdrop-blur-sm">
            <img 
              src={getImageUrl(article.image)} 
              alt={article.title} 
              className="w-full h-auto object-cover aspect-[21/9] rounded-xl"
            />
          </div>

          {/* Nội dung bài viết render bằng HTML từ React Quill */}
          <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-8 shadow-sm lg:p-10">
            <div 
              className="prose prose-slate max-w-none overflow-x-auto prose-img:rounded-xl prose-img:border prose-img:border-slate-200 prose-a:text-orange-600 hover:prose-a:text-orange-700"
              style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: sanitizeContent(article.content) }}
            />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}