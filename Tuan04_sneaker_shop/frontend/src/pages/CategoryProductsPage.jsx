import { useEffect, useState } from 'react';
import { AppstoreOutlined, WarningOutlined } from '@ant-design/icons';
import productApi from '../api/productApi';
import CategoryProductSection from '../components/CategoryProductSection';
import { extractApiData } from '../utils/shop';

function CategoryProductsPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await productApi.getCategories();
        setCategories(extractApiData(response, []));
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Unable to load categories right now.');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="page-shell pb-16">
      <section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,69,0,0.22),_transparent_24%),linear-gradient(135deg,_#0f172a_0%,_#111827_100%)] text-white">
        <div className="content-shell py-14 sm:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.32em] text-orange-300">
              <AppstoreOutlined />
              Shop by Category
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Shop by Category</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Explore sneakers by your favorite style and keep scrolling to reveal more products in each category.
            </p>
          </div>
        </div>
      </section>

      <div className="content-shell space-y-8 py-10">
        {loading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="glass-panel p-6 sm:p-8">
              <div className="mb-6 space-y-3 border-b border-slate-100 pb-5">
                <div className="skeleton-block h-4 w-36 rounded-full" />
                <div className="skeleton-block h-10 w-64" />
                <div className="skeleton-block h-5 w-48 rounded-full" />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((__, cardIndex) => (
                  <div key={cardIndex} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5">
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
            </div>
          ))
        ) : error ? (
          <div className="glass-panel flex min-h-72 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">
              <WarningOutlined />
            </div>
            <h2 className="text-3xl font-bold text-slate-950">Unable to load categories</h2>
            <p className="section-copy max-w-xl">{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="glass-panel flex min-h-72 flex-col items-center justify-center gap-4 p-8 text-center">
            <h2 className="text-3xl font-bold text-slate-950">No categories found</h2>
            <p className="section-copy max-w-xl">There are no active product categories available from the backend API yet.</p>
          </div>
        ) : (
          categories.map((category) => <CategoryProductSection key={category} category={category} />)
        )}
      </div>
    </div>
  );
}

export default CategoryProductsPage;
