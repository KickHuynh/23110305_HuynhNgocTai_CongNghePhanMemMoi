import { useEffect, useState } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import productApi from '../api/productApi';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import CategoryProductSection from '../components/products/CategoryProductSection';
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
        setError(apiError.response?.data?.message || 'Không thể tải danh mục lúc này.');
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
              Mua sắm theo danh mục
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Danh mục sản phẩm</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Khám phá sneaker theo phong cách bạn yêu thích và tiếp tục cuộn để xem thêm sản phẩm trong từng danh mục.
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
          <ErrorMessage title="Không thể tải danh mục" message={error} minHeight="min-h-72" />
        ) : categories.length === 0 ? (
          <EmptyState
            title="Chưa có danh mục"
            description="Hiện chưa có danh mục sản phẩm nào đang hoạt động từ backend."
            minHeight="min-h-72"
          />
        ) : (
          categories.map((category) => <CategoryProductSection key={category} category={category} />)
        )}
      </div>
    </div>
  );
}

export default CategoryProductsPage;
