import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CloseOutlined, FilterOutlined, InboxOutlined, WarningOutlined } from '@ant-design/icons';
import productApi from '../api/productApi';
import ProductFilter from '../components/ProductFilter';
import ProductCard from '../components/ProductCard';
import { cleanFilterParams, extractApiData } from '../utils/shop';

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

const buildSearchParams = (filters) => {
  const params = new URLSearchParams();
  const cleanedFilters = cleanFilterParams(filters);

  Object.entries(cleanedFilters).forEach(([key, value]) => {
    if (key === 'sort' && value === 'newest') {
      return;
    }
    params.set(key, value);
  });

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

  const searchParamString = searchParams.toString();

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await productApi.getProducts();
        setMetadata(getMetadataFromProducts(extractApiData(response, [])));
      } catch {
        setMetadata({ categories: [], brands: [], sizes: [], colors: [] });
      }
    };

    fetchMetadata();
  }, []);

  useEffect(() => {
    const parsedFilters = parseFiltersFromSearchParams(new URLSearchParams(searchParamString));

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await productApi.getProducts(cleanFilterParams(parsedFilters));
        setProducts(extractApiData(response, []));
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Unable to load sneakers for the selected filters.');
        setProducts([]);
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
    setSearchParams(buildSearchParams(filters));
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
    setSearchParams(buildSearchParams(nextFilters));
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
            <h2 className="text-2xl font-bold text-slate-950">{products.length} sneakers</h2>
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
              total={products.length}
            />
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Search Results</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-950">{products.length} sneakers found</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Browse premium sneaker picks tailored to your filters and backend product data.
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
              <div className="glass-panel flex min-h-72 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">
                  <WarningOutlined />
                </div>
                <h3 className="text-2xl font-bold text-slate-950">Unable to load sneakers</h3>
                <p className="section-copy max-w-xl">{error}</p>
                <button type="button" onClick={applyFilters} className="btn-primary">
                  Try again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="glass-panel flex min-h-72 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-500">
                  <InboxOutlined />
                </div>
                <h3 className="text-2xl font-bold text-slate-950">No products found</h3>
                <p className="section-copy max-w-xl">
                  Try adjusting your search keyword, price range, or product options to see more results.
                </p>
                <button type="button" onClick={resetFilters} className="btn-secondary">
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSearchPage;
