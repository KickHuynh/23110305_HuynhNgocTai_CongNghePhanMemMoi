import { useEffect, useState } from 'react';
import { ArrowLeftOutlined, ArrowRightOutlined, CloseOutlined, FilterOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import productApi from '../api/productApi';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';
import { cleanFilterParams, extractApiData, extractPagination, extractProductList } from '../utils/shop';

const defaultFilters = {
  keyword: '',
  category: '',
  brand: '',
  minPrice: '',
  maxPrice: '',
  size: '',
  color: '',
  sort: 'newest',
  inStock: '',
  isPromotion: '',
  isNewProduct: '',
  isBestSeller: '',
};

const filterLabels = {
  keyword: 'Keyword',
  category: 'Category',
  brand: 'Brand',
  minPrice: 'Min',
  maxPrice: 'Max',
  size: 'Size',
  color: 'Color',
  sort: 'Sort',
  inStock: 'Stock',
  isPromotion: 'Promotion',
  isNewProduct: 'New',
  isBestSeller: 'Best Seller',
};

const parseFiltersFromSearchParams = (searchParams) => {
  const parsedFilters = { ...defaultFilters };

  Object.keys(defaultFilters).forEach((key) => {
    const value = searchParams.get(key);
    if (value !== null) {
      parsedFilters[key] = value;
    }
  });

  return parsedFilters;
};

const parsePageFromSearchParams = (searchParams) => {
  const page = Number.parseInt(searchParams.get('page') || '1', 10);

  if (Number.isNaN(page) || page <= 0) {
    return 1;
  }

  return page;
};

const buildSearchParams = (filters, page = 1) => {
  const params = new URLSearchParams();
  const cleanedFilters = cleanFilterParams(filters);

  Object.entries(cleanedFilters).forEach(([key, value]) => {
    if (key === 'sort' && value === 'newest') {
      return;
    }
    params.set(key, value);
  });

  if (page > 1) {
    params.set('page', String(page));
  }

  return params;
};

const getMetadataFromProducts = (products) => ({
  categories: [...new Set(products.map((product) => product.category).filter(Boolean))].sort(),
  brands: [...new Set(products.map((product) => product.brand).filter(Boolean))].sort(),
  sizes: [...new Set(products.flatMap((product) => product.sizes || []).filter(Boolean))].sort((a, b) => Number(a) - Number(b)),
  colors: [...new Set(products.flatMap((product) => product.colors || []).filter(Boolean))].sort(),
});

function ProductSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => parseFiltersFromSearchParams(searchParams));
  const [products, setProducts] = useState([]);
  const [metadata, setMetadata] = useState({ categories: [], brands: [], sizes: [], colors: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const searchParamString = searchParams.toString();

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          productApi.getCategories(),
          productApi.getProducts({ page: 1, limit: 1000 }),
        ]);

        setMetadata({
          ...getMetadataFromProducts(extractProductList(productsResponse, [])),
          categories: extractApiData(categoriesResponse, []),
        });
      } catch {
        setMetadata({ categories: [], brands: [], sizes: [], colors: [] });
      }
    };

    fetchMetadata();
  }, []);

  useEffect(() => {
    const parsedSearchParams = new URLSearchParams(searchParamString);
    const parsedFilters = parseFiltersFromSearchParams(parsedSearchParams);
    const currentPage = parsePageFromSearchParams(parsedSearchParams);

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        setFilters(parsedFilters);

        const response = await productApi.getProducts({
          ...cleanFilterParams(parsedFilters),
          page: currentPage,
          limit: 12,
        });

        setProducts(extractProductList(response, []));

        const nextPagination = extractPagination(response, {});
        setPagination({
          page: nextPagination.page || currentPage,
          limit: nextPagination.limit || 12,
          total: nextPagination.total || 0,
          totalPages: nextPagination.totalPages || 1,
          hasNextPage: Boolean(nextPagination.hasNextPage),
          hasPrevPage: Boolean(nextPagination.hasPrevPage),
        });
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Unable to load sneakers for the selected filters.');
        setProducts([]);
        setPagination({
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParamString]);

  const activeFilters = Object.entries(filters).filter(([key, value]) => {
    if (!value) return false;
    if (key === 'sort' && value === 'newest') return false;
    return true;
  });

  const applyFilters = () => {
    setSearchParams(buildSearchParams(filters, 1));
    setMobileFiltersOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSearchParams(new URLSearchParams());
    setMobileFiltersOpen(false);
  };

  const removeFilter = (key) => {
    const nextFilters = { ...filters, [key]: defaultFilters[key] };
    setFilters(nextFilters);
    setSearchParams(buildSearchParams(nextFilters, 1));
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages || nextPage === pagination.page) {
      return;
    }

    setSearchParams(buildSearchParams(filters, nextPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-shell pb-16">
      <section className="overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(255,69,0,0.22),_transparent_24%),linear-gradient(135deg,_#0f172a_0%,_#111827_100%)] text-white">
        <div className="content-shell py-14 sm:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.32em] text-orange-300">
              <FilterOutlined />
              Explore Sneakers
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Explore Sneakers</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Find your perfect pair from our latest sneaker collection. Filter by style, brand, price range, size,
              and color to narrow in on the best match.
            </p>
          </div>
        </div>
      </section>

      <div className="content-shell py-10">
        <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Product Count</p>
            <h2 className="text-2xl font-bold text-slate-950">{pagination.total} sneakers</h2>
          </div>
          <button type="button" onClick={() => setMobileFiltersOpen((current) => !current)} className="btn-secondary px-5 py-3">
            <FilterOutlined />
            Filters
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
            <ProductFilter
              filters={filters}
              setFilters={setFilters}
              onApply={applyFilters}
              onReset={resetFilters}
              metadata={metadata}
              total={pagination.total}
            />
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Search Results</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-950">{pagination.total} sneakers found</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Browse premium sneaker picks tailored to your filters and backend product data. Page {pagination.page} of {pagination.totalPages}.
                  </p>
                </div>

                {activeFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map(([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => removeFilter(key)}
                        className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
                      >
                        <span>
                          {filterLabels[key] || key}: {value === 'true' ? 'Yes' : value}
                        </span>
                        <CloseOutlined className="text-xs" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5">
                    <div className="skeleton-block aspect-[4/4.25] w-full rounded-3xl" />
                    <div className="mt-4 space-y-3">
                      <div className="skeleton-block h-4 w-24 rounded-full" />
                      <div className="skeleton-block h-6 w-full" />
                      <div className="skeleton-block h-6 w-3/4" />
                      <div className="skeleton-block h-12 w-full rounded-2xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <ErrorMessage
                title="Unable to load sneakers"
                message={error}
                minHeight="min-h-72"
                action={
                  <button type="button" onClick={applyFilters} className="btn-primary">
                    Try again
                  </button>
                }
              />
            ) : products.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try adjusting your search keyword, price range, or product options to see more results."
                minHeight="min-h-72"
                action={
                  <button type="button" onClick={resetFilters} className="btn-secondary">
                    Reset filters
                  </button>
                }
              />
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                <div className="glass-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.24em] text-orange-600">Pagination</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Showing page {pagination.page} of {pagination.totalPages} with {pagination.limit} products per page.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrevPage}
                      className={`btn-secondary px-5 py-3 ${!pagination.hasPrevPage ? 'cursor-not-allowed opacity-50 hover:translate-y-0 hover:border-slate-300 hover:text-slate-900' : ''}`}
                    >
                      <ArrowLeftOutlined />
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNextPage}
                      className={`btn-primary px-5 py-3 ${!pagination.hasNextPage ? 'cursor-not-allowed opacity-50 hover:translate-y-0 hover:bg-orange-600' : ''}`}
                    >
                      Next
                      <ArrowRightOutlined />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSearchPage;
