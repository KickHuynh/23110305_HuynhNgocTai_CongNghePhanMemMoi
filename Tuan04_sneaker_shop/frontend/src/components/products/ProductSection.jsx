import { ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import EmptyState from '../common/EmptyState';
import ErrorMessage from '../common/ErrorMessage';
import ProductCard from './ProductCard';

function ProductSection({ title, subtitle, products = [], loading = false, error = '', viewAllLink = '' }) {
  return (
    <section className="content-shell py-12 sm:py-14 lg:py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-3">
            <span className="accent-dot" />
            <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-orange-600">SneakerHub Edit</p>
          </div>
          <h2 className="section-heading">{title}</h2>
          {subtitle && <p className="section-copy mt-3">{subtitle}</p>}
        </div>

        {viewAllLink && (
          <Link to={viewAllLink} className="btn-secondary self-start px-5 py-3 sm:self-auto">
            View all
            <ArrowRightOutlined />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5">
              <div className="skeleton-block aspect-[4/4.25] w-full rounded-3xl" />
              <div className="mt-4 space-y-3">
                <div className="skeleton-block h-4 w-24 rounded-full" />
                <div className="skeleton-block h-6 w-full" />
                <div className="skeleton-block h-6 w-2/3" />
                <div className="skeleton-block h-12 w-full rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorMessage title="Unable to load this section" message={error} />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No products available"
          description="This collection is still being prepared. Please check again in a moment."
        />
      )}
    </section>
  );
}

export default ProductSection;
