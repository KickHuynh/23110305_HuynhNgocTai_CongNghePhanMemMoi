import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightOutlined, FireFilled, RocketOutlined, SafetyCertificateOutlined, ThunderboltOutlined } from '@ant-design/icons';
import HorizontalProductCarousel from '../components/HorizontalProductCarousel';
import ProductSection from '../components/ProductSection';
import productApi from '../api/productApi';
import heroSneaker from '../assets/hero.png';
import { extractApiData } from '../utils/shop';

const stats = [
  { label: 'Products', value: '100+', icon: <FireFilled /> },
  { label: 'Brands', value: '20+', icon: <RocketOutlined /> },
  { label: 'Free Shipping', value: 'Nationwide', icon: <ThunderboltOutlined /> },
  { label: 'Best Price', value: 'Always On', icon: <SafetyCertificateOutlined /> },
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
        setError(apiError.response?.data?.message || 'Unable to load the SneakerHub home collection right now.');
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
              New Season
            </div>
            <h1 className="max-w-xl text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Step Into Your Style
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Discover premium sneakers for every move, every day, and every style. Curated drops, hot promotions,
              and performance-ready pairs all in one modern storefront.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/products" className="btn-primary px-7 py-3.5 text-sm sm:text-base">
                Shop Now
                <ArrowRightOutlined />
              </Link>
              <Link to="/products?sort=best_seller" className="btn-secondary border-white/20 bg-white/10 px-7 py-3.5 text-white hover:border-orange-300 hover:text-orange-300">
                Best Sellers
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="rounded-full border border-orange-400/30 bg-orange-500/15 px-4 py-2 text-sm font-bold text-orange-200">
                UP TO 50% OFF
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-100">
                Limited sneaker drops every week
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-6 h-40 w-40 rounded-full bg-orange-500/25 blur-3xl" />
            <div className="absolute bottom-4 right-6 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />
            <div className="relative rounded-[36px] border border-white/10 bg-white/8 p-4 shadow-2xl shadow-slate-950/35 backdrop-blur">
              <img src={heroSneaker} alt="SneakerHub hero sneaker" className="mx-auto w-full max-w-xl object-contain drop-shadow-[0_28px_80px_rgba(0,0,0,0.45)]" />
              <div className="absolute right-4 top-4 rounded-3xl border border-white/15 bg-slate-950/75 px-4 py-3 shadow-xl backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-300">Drop of the week</p>
                <p className="mt-1 text-lg font-bold text-white">Street-ready comfort</p>
              </div>
              <div className="absolute -bottom-4 left-4 rounded-3xl border border-white/15 bg-white px-4 py-3 text-slate-950 shadow-xl">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-600">UP TO 50% OFF</p>
                <p className="mt-1 text-lg font-bold">Selected premium pairs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-shell -mt-10 relative z-10">
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
        title="Top 10 Best Sellers"
        subtitle="The sneakers customers love the most"
        products={sections.topBestSellers}
        loading={loading}
        error={error}
        viewAllLink="/products?sort=best_seller"
      />

      <HorizontalProductCarousel
        title="Top 10 Most Viewed"
        subtitle="Trending pairs people are checking out"
        products={sections.topMostViewed}
        loading={loading}
        error={error}
        viewAllLink="/products?sort=most_viewed"
      />

      <ProductSection
        title="Hot Promotions"
        subtitle="Fresh markdowns on standout silhouettes built for daily wear."
        products={sections.promotions}
        loading={loading}
        error={error}
        viewAllLink="/products?isPromotion=true"
      />

      <ProductSection
        title="New Arrivals"
        subtitle="Latest sneakers that just touched down at SneakerHub."
        products={sections.newProducts}
        loading={loading}
        error={error}
        viewAllLink="/products?sort=newest&isNewProduct=true"
      />

      <ProductSection
        title="Best Sellers"
        subtitle="Community favorites with strong reviews and repeat demand."
        products={sections.bestSellers}
        loading={loading}
        error={error}
        viewAllLink="/products?sort=best_seller&isBestSeller=true"
      />
    </div>
  );
}

export default HomePage;
