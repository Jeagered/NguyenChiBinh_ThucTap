import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import fallbackImage from '../assets/banner2.png';
import 'react-quill-new/dist/quill.snow.css'; // Import CSS gốc của Quill

const API_URL = 'http://localhost:5000/api';
const SERVER_URL = 'http://localhost:5000';

function getImageUrl(image) {
  if (!image) return fallbackImage;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/')) return `${SERVER_URL}${image}`;
  return `${SERVER_URL}/${image}`;
}

// Hàm làm sạch HTML
const sanitizeContent = (html) => {
  if (!html) return '';
  return html.replace(/style="[^"]*"/g, '');
};

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        // Lấy tất cả dịch vụ rồi lọc ra (Xử lý trường hợp BE chưa có API GET /services/:id)
        const res = await fetch(`${API_URL}/services`);
        const data = await res.json();
        
        if (data.success) {
          // Tìm dịch vụ khớp với ID hoặc Slug trên URL
          const foundService = data.data.find(s => s._id === id || s.slug === id);
          if (foundService) {
            setService(foundService);
          } else {
            setError('Không tìm thấy thông tin dịch vụ.');
          }
        } else {
          setError(data.message || 'Lỗi khi tải dữ liệu dịch vụ.');
        }
      } catch (err) {
        setError('Lỗi kết nối đến máy chủ.');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header variant="compact" />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-xl font-medium text-slate-500 animate-pulse">Đang tải thông tin dịch vụ...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header variant="compact" />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-xl font-bold text-red-600">{error}</p>
            <Link to="/services" className="text-orange-600 font-bold hover:text-orange-700 transition">
              &larr; Quay lại danh sách dịch vụ
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
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link to="/services" className="text-sm font-bold text-orange-600 hover:text-orange-700 transition">
              &larr; Tất cả dịch vụ
            </Link>
          </div>

          {/* Tổng quan dịch vụ */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            
            {/* Cột trái: Hình ảnh */}
            <div className="overflow-hidden rounded-2xl shadow-lg border border-white bg-white/50 backdrop-blur-sm p-2">
              <img 
                src={getImageUrl(service.image)} 
                alt={service.title} 
                className="w-full h-auto object-cover aspect-[4/3] rounded-xl"
              />
            </div>
            
            {/* Cột phải: Thông tin */}
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-black uppercase tracking-wide text-slate-900 md:text-4xl lg:leading-tight">
                {service.title}
              </h1>
              <div className="mt-6 text-lg leading-relaxed text-slate-700 whitespace-pre-line text-justify font-medium">
                {service.summary || 'Thông tin tổng quan về dịch vụ đang được cập nhật.'}
              </div>
              
              <div className="mt-10">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center justify-center rounded-md bg-orange-500 px-8 py-3.5 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-1 hover:bg-orange-600 hover:shadow-orange-600/40"
                >
                  Liên hệ nhận tư vấn ngay
                </Link>
              </div>
            </div>

          </div>

          {/* Phần mô tả chi tiết */}
          <div className="mt-16 rounded-2xl border border-white bg-white/80 backdrop-blur-md p-8 shadow-sm lg:p-10">
            <h2 className="mb-6 text-2xl font-black uppercase tracking-wide text-slate-900 border-b border-slate-100 pb-4">
              Chi tiết dịch vụ
            </h2>
            <div 
              className="prose prose-slate max-w-none overflow-x-auto prose-img:rounded-xl prose-img:border prose-img:border-slate-200 prose-a:text-orange-600 hover:prose-a:text-orange-700"
              style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: sanitizeContent(service.content) || 'Nội dung chi tiết đang được cập nhật...' }}
            />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}