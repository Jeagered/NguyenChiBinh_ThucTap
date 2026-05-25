import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import fallbackImage from '../assets/banner1.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

function getImageUrl(image) {
  if (!image) return fallbackImage;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/')) return `${SERVER_URL}${image}`;
  return `${SERVER_URL}/${image}`;
}

const normalizeTextSpacing = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    node.nodeValue = node.nodeValue.replace(/\u00a0/g, ' ');
  });
};

const sanitizeContent = (html) => {
  if (!html) return '';

  if (typeof window === 'undefined' || !window.DOMParser) {
    return html.replace(/\sstyle=(["']).*?\1/gi, '').replace(/&nbsp;/gi, ' ');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blockedTags = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'];
  const allowedClasses = new Set([
    'ql-align-center',
    'ql-align-right',
    'ql-align-justify',
    'ql-indent-1',
    'ql-indent-2',
    'ql-indent-3',
    'ql-indent-4',
    'ql-indent-5',
    'ql-indent-6',
    'ql-indent-7',
    'ql-indent-8',
    'ql-size-small',
    'ql-size-large',
    'ql-size-huge'
  ]);

  doc.body.querySelectorAll(blockedTags.join(',')).forEach((node) => node.remove());
  normalizeTextSpacing(doc.body);
  doc.body.querySelectorAll('*').forEach((node) => {
    [...node.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim();

      if (name === 'style' || name.startsWith('on')) {
        node.removeAttribute(attr.name);
        return;
      }

      if ((name === 'href' || name === 'src') && /^javascript:/i.test(value)) {
        node.removeAttribute(attr.name);
        return;
      }

      if (name === 'class') {
        const keptClasses = value.split(/\s+/).filter((className) => allowedClasses.has(className));
        if (keptClasses.length) node.setAttribute('class', keptClasses.join(' '));
        else node.removeAttribute('class');
      }
    });
  });

  return doc.body.innerHTML;
};

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${API_URL}/news`);
        const data = await res.json();

        if (data.success) {
          const found = data.data?.find((news) => news._id === id || news.slug === id);
          if (found) setArticle(found);
          else setError('Không tìm thấy bài viết.');
        } else {
          setError(data.message || 'Lỗi khi tải dữ liệu bài viết.');
        }
      } catch {
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

          <h1 className="mb-7 break-words pb-1 text-3xl font-black leading-[1.28] text-slate-900 md:text-5xl md:leading-[1.22]">
            {article.title}
          </h1>

          <div className="mb-10 overflow-hidden rounded-xl border border-white bg-white/50 p-2 shadow-sm backdrop-blur-sm">
            <img
              src={getImageUrl(article.image)}
              alt={article.title}
              className="w-full h-auto object-cover aspect-[21/9] rounded-xl"
            />
          </div>

          <div className="rounded-xl border border-white bg-white/80 p-5 shadow-sm sm:p-8 lg:p-10">
            <div
              className="rich-content"
              dangerouslySetInnerHTML={{ __html: sanitizeContent(article.content) }}
            />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
