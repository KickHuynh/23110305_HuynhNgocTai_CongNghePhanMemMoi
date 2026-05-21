import { useRef } from 'react';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import EmptyState from '../common/EmptyState';
import ErrorMessage from '../common/ErrorMessage';
import ProductCard from './ProductCard';

function HorizontalProductCarousel({
  title,
  subtitle,
  products = [],
  loading = false,
  error = '',
  viewAllLink = '',
}) {
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (!scrollContainerRef.current) {
      return;
    }

    scrollContainerRef.current.scrollBy({
      left: direction === 'next' ? 320 : -320,
      behavior: 'smooth',
    });
  };

  return (
    <section className="content-shell py-12 sm:py-14">
      <div className="glass-panel overflow-hidden p-6 sm:p-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-orange-600">SneakerHub Rankings</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
            {subtitle && <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">{subtitle}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {viewAllLink && (
              <Link to={viewAllLink} className="btn-secondary px-5 py-3">
                View all
              </Link>
            )}
            <button type="button" onClick={() => handleScroll('prev')} className="btn-secondary px-4 py-3">
              <ArrowLeftOutlined />
              Previous
            </button>
            <button type="button" onClick={() => handleScroll('next')} className="btn-primary px-4 py-3">
              Next
              <ArrowRightOutlined />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="min-w-[260px] sm:min-w-[280px]">
                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5">
                  <div className="skeleton-block aspect-[4/4.25] w-full rounded-3xl" />
                  <div className="mt-4 space-y-3">
                    <div className="skeleton-block h-4 w-24 rounded-full" />
                    <div className="skeleton-block h-6 w-full" />
                    <div className="skeleton-block h-6 w-2/3" />
                    <div className="skeleton-block h-12 w-full rounded-2xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorMessage title="Unable to load this ranking" message={error} minHeight="min-h-64" className="rounded-[28px]" />
        ) : products.length > 0 ? (
          <div ref={scrollContainerRef} className="scrollbar-none flex gap-6 overflow-x-auto scroll-smooth pb-2">
            {products.map((product) => (
              <div key={product._id} className="max-w-[280px] min-w-[260px] sm:min-w-[280px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No products available"
            description="This ranking will appear here once active products are available from the backend API."
            minHeight="min-h-64"
            className="rounded-[28px]"
          />
        )}
      </div>
    </section>
  );
}

export default HorizontalProductCarousel;
