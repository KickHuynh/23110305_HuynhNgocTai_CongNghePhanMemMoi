import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightOutlined, FireFilled, RocketOutlined, SafetyCertificateOutlined, ThunderboltOutlined } from '@ant-design/icons';
import HorizontalProductCarousel from '../components/products/HorizontalProductCarousel';
import ProductSection from '../components/products/ProductSection';
import productApi from '../api/productApi';
import heroSneaker from '../assets/hero.png';
import { extractApiData } from '../utils/shop';

const stats = [
  { label: 'Sản phẩm', value: '100+', icon: <FireFilled /> },
  { label: 'Thương hiệu', value: '20+', icon: <RocketOutlined /> },
  { label: 'Miễn phí vận chuyển', value: 'Toàn quốc', icon: <ThunderboltOutlined /> },
  { label: 'Giá tốt', value: 'Luôn sẵn', icon: <SafetyCertificateOutlined /> },
];

function HomePage() {
  const [sections, setSections] = useState({
    promotions: [],
    newProducts: [],
    bestSellers: [],
    topBestSellers: [],
    topMostViewed: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Tải dữ liệu các bộ sưu tập chính khi trang chủ được mở lần đầu.
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError('');

        const [promotionResponse, newResponse, bestSellerResponse, topBestSellerResponse, topMostViewedResponse] = await Promise.all([
          productApi.getPromotionProducts(),
          productApi.getNewProducts(),
          productApi.getBestSellerProducts(),
          productApi.getTopBestSellers(10),
          productApi.getTopMostViewed(10),
        ]);

        setSections({
          promotions: extractApiData(promotionResponse, []),
          newProducts: extractApiData(newResponse, []),
          bestSellers: extractApiData(bestSellerResponse, []),
          topBestSellers: extractApiData(topBestSellerResponse, []),
          topMostViewed: extractApiData(topMostViewedResponse, []),
        });
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Không thể tải bộ sưu tập SneakerHub lúc này.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="page-shell pb-16">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,69,0,0.25),_transparent_28%),linear-gradient(135deg,_#020617_0%,_#111827_55%,_#1f2937_100%)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.06),_transparent_22%)]" />
        <div className="content-shell relative grid gap-10 py-14 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.32em] text-orange-300 backdrop-blur">
              <FireFilled />
              Bộ sưu tập mùa mới
            </div>
            <h1 className="max-w-xl text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Nâng tầm phong cách cùng sneaker
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Khám phá các mẫu sneaker cao cấp cho mọi chuyển động, mọi ngày và mọi phong cách.
              Từ sản phẩm mới, deal nổi bật đến những đôi giày hiệu năng cao trong một storefront hiện đại.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/products" className="btn-primary px-7 py-3.5 text-sm sm:text-base">
                Mua ngay
                <ArrowRightOutlined />
              </Link>
              <Link to="/products?sort=best_seller" className="btn-secondary border-white/20 bg-white/10 px-7 py-3.5 text-white hover:border-orange-300 hover:text-orange-300">
                Sản phẩm bán chạy
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="rounded-full border border-orange-400/30 bg-orange-500/15 px-4 py-2 text-sm font-bold text-orange-200">
                GIẢM ĐẾN 50%
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-100">
                Hàng tuần đều có đợt mở bán sneaker giới hạn
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-6 h-40 w-40 rounded-full bg-orange-500/25 blur-3xl" />
            <div className="absolute bottom-4 right-6 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />
            <div className="relative rounded-[36px] border border-white/10 bg-white/8 p-4 shadow-2xl shadow-slate-950/35 backdrop-blur">
              <img src={heroSneaker} alt="SneakerHub hero sneaker" className="mx-auto w-full max-w-xl object-contain drop-shadow-[0_28px_80px_rgba(0,0,0,0.45)]" />
              <div className="absolute right-4 top-4 rounded-3xl border border-white/15 bg-slate-950/75 px-4 py-3 shadow-xl backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-300">Điểm nhấn tuần này</p>
                <p className="mt-1 text-lg font-bold text-white">Êm chân, đậm chất đường phố</p>
              </div>
              <div className="absolute -bottom-4 left-4 rounded-3xl border border-white/15 bg-white px-4 py-3 text-slate-950 shadow-xl">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-600">GIẢM ĐẾN 50%</p>
                <p className="mt-1 text-lg font-bold">Nhiều mẫu cao cấp được chọn lọc</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-shell relative z-10 -mt-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-panel flex items-center gap-4 p-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-xl text-white">
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-950">{stat.value}</p>
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <HorizontalProductCarousel
        title="Top 10 sản phẩm bán chạy"
        subtitle="Những đôi sneaker được khách hàng yêu thích nhất"
        products={sections.topBestSellers}
        loading={loading}
        error={error}
        viewAllLink="/products?sort=best_seller"
      />

      <HorizontalProductCarousel
        title="Top 10 sản phẩm được xem nhiều"
        subtitle="Những mẫu sneaker đang thu hút nhiều lượt quan tâm"
        products={sections.topMostViewed}
        loading={loading}
        error={error}
        viewAllLink="/products?sort=most_viewed"
      />

      <ProductSection
        title="Khuyến mãi nổi bật"
        subtitle="Nhiều mức giá ưu đãi cho các mẫu sneaker nổi bật, phù hợp sử dụng hằng ngày."
        products={sections.promotions}
        loading={loading}
        error={error}
        viewAllLink="/products?isPromotion=true"
      />

      <ProductSection
        title="Sản phẩm mới"
        subtitle="Những mẫu sneaker vừa cập bến tại SneakerHub."
        products={sections.newProducts}
        loading={loading}
        error={error}
        viewAllLink="/products?sort=newest&isNewProduct=true"
      />

      <ProductSection
        title="Bán chạy"
        subtitle="Các mẫu được cộng đồng yêu thích với đánh giá tốt và nhu cầu cao."
        products={sections.bestSellers}
        loading={loading}
        error={error}
        viewAllLink="/products?sort=best_seller&isBestSeller=true"
      />
    </div>
  );
}

export default HomePage;
