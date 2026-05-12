import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import fallbackImage from '../assets/banner2.png';

const API_URL = 'http://localhost:5000/api';
const SERVER_URL = 'http://localhost:5000';

function getImageUrl(image) {
  if (!image) return fallbackImage;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/')) return `${SERVER_URL}${image}`;
  return `${SERVER_URL}/${image}`;
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_URL}/services`);
        const data = await res.json();
        
        if (data.success) {
          setServices(data.data || []);
        } else {
          setError(data.message || 'Không thể tải danh sách dịch vụ.');
        }
      } catch (err) {
        setError('Lỗi kết nối đến máy chủ.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:20px_20px]">
      <Header variant="compact" />

      <main className="flex-1">
        {/* Tiêu đề trang */}
        <section className="border-b border-slate-200/50 bg-white/70 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 py-12 text-center lg:px-10">
            <p className="m-0 text-sm font-black uppercase tracking-[0.16em] text-orange-600">
              THUCTAPGROUP
            </p>
            <h1 className="m-0 mt-3 text-4xl font-black uppercase tracking-wide text-slate-950 md:text-5xl">
              Dịch vụ của chúng tôi
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-600">
              Cung cấp các giải pháp gia công cơ khí chính xác, thiết kế và lắp đặt hệ thống tự động hóa chất lượng cao đáp ứng mọi nhu cầu của doanh nghiệp.
            </p>
          </div>
        </section>

        {/* Danh sách Dịch vụ */}
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
          ) : services.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white">
              <p className="text-lg font-bold text-slate-500">Chưa có dịch vụ nào được cập nhật.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Link
                  key={service._id}
                  to={`/services/${service.slug || service._id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md text-slate-900 no-underline shadow-sm ring-1 ring-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-900/10 hover:ring-orange-500/50"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={getImageUrl(service.image)}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="mb-3 text-xl font-black uppercase leading-tight tracking-wide text-slate-900 transition-colors group-hover:text-orange-600">
                      {service.title}
                    </h2>
                    <p className="mb-6 flex-1 text-sm font-medium leading-relaxed text-slate-600 line-clamp-3">
                      {service.summary || 'Thông tin chi tiết về dịch vụ đang được cập nhật.'}
                    </p>
                    <div className="mt-auto flex items-center text-sm font-black uppercase tracking-wide text-orange-500">
                      Xem chi tiết <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">→</span>
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