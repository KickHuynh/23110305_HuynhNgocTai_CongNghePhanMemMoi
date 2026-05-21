import { useCallback, useEffect, useRef, useState } from 'react';
import productApi from '../../api/productApi';
import { extractPagination, extractProductList } from '../../utils/shop';
import EmptyState from '../common/EmptyState';
import ErrorMessage from '../common/ErrorMessage';
import ProductCard from './ProductCard';

const INITIAL_PAGINATION = {
  page: 1,
  limit: 8,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

function CategoryProductSection({ category }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasNextPage, setHasNextPage] = useState(true);
  const [pagination, setPagination] = useState(INITIAL_PAGINATION);
  const sentinelRef = useRef(null);
  const requestInFlightRef = useRef(false);

  const loadProducts = useCallback(
    async (nextPage, replaceProducts = false) => {
      if (requestInFlightRef.current) {
        return;
      }

      if (replaceProducts) {
        setProducts([]);
        setPage(1);
        setHasNextPage(true);
        setPagination(INITIAL_PAGINATION);
        setError('');
      }

      requestInFlightRef.current = true;
      setLoading(true);

      try {
        const response = await productApi.getProducts({
          category,
          page: nextPage,
          limit: 8,
        });

        const nextProducts = extractProductList(response, []);
        const nextPagination = extractPagination(response, INITIAL_PAGINATION);

        setProducts((currentProducts) => (replaceProducts ? nextProducts : [...currentProducts, ...nextProducts]));
        setPage(nextPagination.page || nextPage);
        setPagination({
          page: nextPagination.page || nextPage,
          limit: nextPagination.limit || 8,
          total: nextPagination.total || nextProducts.length,
          totalPages: nextPagination.totalPages || 1,
          hasNextPage: Boolean(nextPagination.hasNextPage),
          hasPrevPage: Boolean(nextPagination.hasPrevPage),
        });
        setHasNextPage(Boolean(nextPagination.hasNextPage));
        setError('');
      } catch (apiError) {
        setError(apiError.response?.data?.message || `Unable to load ${category} sneakers right now.`);
        if (replaceProducts) {
          setProducts([]);
          setPagination(INITIAL_PAGINATION);
        }
      } finally {
        requestInFlightRef.current = false;
        setLoading(false);
      }
    },
    [category]
  );

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      loadProducts(1, true);
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadProducts]);

  useEffect(() => {
    if (!sentinelRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry?.isIntersecting || !hasNextPage || requestInFlightRef.current) {
          return;
        }

        loadProducts(page + 1);
      },
      {
        rootMargin: '200px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, loadProducts, page]);

  const showInitialSkeleton = loading && products.length === 0;

  return (
    <section className="glass-panel p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-orange-600">Shop by Category</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{category}</h2>
          <p className="mt-2 text-sm text-slate-500">Showing products in {category}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          {pagination.total} products available
        </div>
      </div>

      {showInitialSkeleton ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
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
      ) : error && products.length === 0 ? (
        <ErrorMessage
          title={`Unable to load ${category}`}
          message={error}
          minHeight="min-h-64"
          className="rounded-[28px]"
          action={
            <button type="button" onClick={() => loadProducts(1, true)} className="btn-primary">
              Try again
            </button>
          }
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="This category is active but there are no sneakers to display right now."
          minHeight="min-h-64"
          className="rounded-[28px]"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </>
      )}

      <div ref={sentinelRef} className="mt-6 flex min-h-10 items-center justify-center text-sm font-semibold text-slate-500">
        {loading && products.length > 0 ? 'Loading more products...' : hasNextPage ? 'Scroll down to load more products' : 'No more products'}
      </div>
    </section>
  );
}

export default CategoryProductSection;
