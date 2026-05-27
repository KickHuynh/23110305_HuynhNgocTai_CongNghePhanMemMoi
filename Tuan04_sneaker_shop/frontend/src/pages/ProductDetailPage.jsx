import { useEffect, useState } from 'react';
import { ArrowLeftOutlined, CheckCircleFilled, ShoppingCartOutlined, StarFilled } from '@ant-design/icons';
import { message } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getStoredToken } from '../api/authApi';
import cartApi from '../api/cartApi';
import ErrorMessage from '../components/common/ErrorMessage';
import QuantitySelector from '../components/common/QuantitySelector';
import ProductImageSwiper from '../components/products/ProductImageSwiper';
import ProductSection from '../components/products/ProductSection';
import productApi from '../api/productApi';
import { extractApiData, formatCurrency, hasSalePrice, sanitizeText } from '../utils/shop';

const renderStars = (rating = 5) =>
  Array.from({ length: 5 }).map((_, index) => (
    <StarFilled key={index} className={index < Math.round(rating) ? 'text-amber-400' : 'text-slate-300'} />
  ));

function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError('');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const [productResponse, relatedResponse] = await Promise.all([
          productApi.getProductById(productId),
          productApi.getRelatedProducts(productId),
        ]);

        const fetchedProduct = extractApiData(productResponse, null);
        setProduct(fetchedProduct);
        setRelatedProducts(extractApiData(relatedResponse, []));
        setSelectedSize('');
        setSelectedColor('');
        setQuantity(1);
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Không thể tải sản phẩm này lúc này.');
        setProduct(null);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="content-shell py-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="glass-panel p-6">
              <div className="skeleton-block aspect-square w-full rounded-[28px]" />
            </div>
            <div className="glass-panel p-6 sm:p-8">
              <div className="space-y-4">
                <div className="skeleton-block h-5 w-28 rounded-full" />
                <div className="skeleton-block h-12 w-full" />
                <div className="skeleton-block h-12 w-2/3" />
                <div className="skeleton-block h-8 w-1/3" />
                <div className="skeleton-block h-24 w-full rounded-3xl" />
                <div className="skeleton-block h-12 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-shell">
        <div className="content-shell py-16">
          <ErrorMessage
            title={error || 'Không tìm thấy sản phẩm'}
            message="Sản phẩm bạn đang xem hiện không khả dụng hoặc đã bị gỡ khỏi danh mục."
            minHeight="min-h-[420px]"
            action={
              <button type="button" onClick={() => navigate('/products')} className="btn-primary">
                <ArrowLeftOutlined />
                Quay lại sản phẩm
              </button>
            }
          />
        </div>
      </div>
    );
  }

  const outOfStock = Number(product.stock) <= 0;
  const displayPrice = hasSalePrice(product) ? product.salePrice : product.price;
  const saleAmount = hasSalePrice(product) ? Number(product.price) - Number(product.salePrice) : 0;
  const formattedViews = Number(product.views || 0).toLocaleString('vi-VN');

  const handleAddToCart = async () => {
    if (!getStoredToken()) {
      navigate('/login', {
        state: {
          from: `/products/${productId}`,
          message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.',
        },
      });
      return;
    }

    if (product.sizes?.length && !selectedSize) {
      message.warning('Vui lòng chọn kích cỡ trước.');
      return;
    }

    if (product.colors?.length && !selectedColor) {
      message.warning('Vui lòng chọn màu sắc trước.');
      return;
    }

    try {
      setAddingToCart(true);

      await cartApi.addToCart({
        productId: product._id,
        size: product.sizes?.length ? selectedSize : 'Standard',
        color: product.colors?.length ? selectedColor : 'Default',
        quantity,
      });

      message.success('Thêm vào giỏ hàng thành công.');
      navigate('/cart');
    } catch (apiError) {
      message.error(apiError.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng lúc này.');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="page-shell pb-16">
      <div className="content-shell py-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
          <Link to="/" className="transition hover:text-orange-600">
            Trang chủ
          </Link>
          <span>/</span>
          <Link to="/products" className="transition hover:text-orange-600">
            Sản phẩm
          </Link>
          <span>/</span>
          <span className="truncate text-slate-900">{sanitizeText(product.name)}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-panel p-5 sm:p-6">
            <ProductImageSwiper images={product.images || []} />
          </div>

          <div className="glass-panel p-6 sm:p-8">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-white">
                {product.category}
              </span>
              {hasSalePrice(product) && (
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-orange-600">
                  Khuyến mãi
                </span>
              )}
              {(product.isNew || product.isNewProduct) && (
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-sky-600">
                  Mới
                </span>
              )}
              {product.isBestSeller && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">
                  Bán chạy
                </span>
              )}
            </div>

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-600">{product.brand}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{sanitizeText(product.name)}</h1>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
              <span className="font-semibold text-slate-700">{product.rating || 5}/5</span>
              <span className="text-slate-400">{product.numReviews || 0} đánh giá</span>
              <span className="text-slate-400">{product.sold || 0} đã bán</span>
              <span className="text-slate-400">Lượt xem: {formattedViews}</span>
            </div>

            <div className="mt-6 rounded-[28px] border border-orange-100 bg-orange-50/60 p-5">
              <div className="flex flex-wrap items-end gap-3">
                <p className="text-3xl font-bold text-orange-600">{formatCurrency(displayPrice)}</p>
                {hasSalePrice(product) && (
                  <p className="pb-1 text-lg font-semibold text-slate-400 line-through">{formatCurrency(product.price)}</p>
                )}
              </div>
              {hasSalePrice(product) && (
                <p className="mt-2 text-sm font-semibold text-orange-700">Bạn tiết kiệm {formatCurrency(saleAmount)}</p>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className={`rounded-2xl border px-4 py-3 ${outOfStock ? 'border-red-100 bg-red-50 text-red-600' : 'border-emerald-100 bg-emerald-50 text-emerald-700'}`}>
                <p className="text-xs font-bold uppercase tracking-[0.24em]">Tồn kho</p>
                <p className="mt-1 text-lg font-bold">{outOfStock ? 'Hết hàng' : 'Còn hàng'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                <p className="text-xs font-bold uppercase tracking-[0.24em]">Số lượng hiện có</p>
                <p className="mt-1 text-lg font-bold">{product.stock || 0} đôi</p>
              </div>
            </div>

            {product.sizes?.length > 0 && (
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-900">Chọn kích cỡ</p>
                  <p className="text-sm font-semibold text-slate-500">{selectedSize ? `Đã chọn: ${selectedSize}` : 'Vui lòng chọn kích cỡ'}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-14 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                        selectedSize === size
                          ? 'border-slate-950 bg-slate-950 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-orange-400 hover:text-orange-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-900">Chọn màu sắc</p>
                  <p className="text-sm font-semibold text-slate-500">{selectedColor || 'Vui lòng chọn màu sắc'}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                        selectedColor === color
                          ? 'border-slate-950 bg-slate-950 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-orange-400 hover:text-orange-600'
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-white/40"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.24em] text-slate-900">Số lượng</p>
                <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={Math.max(product.stock || 1, 1)} disabled={outOfStock} />
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={outOfStock || addingToCart}
                className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-bold transition ${
                  outOfStock || addingToCart
                    ? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400'
                    : 'bg-orange-600 text-white shadow-lg shadow-orange-600/25 hover:-translate-y-0.5 hover:bg-orange-700'
                }`}
              >
                <ShoppingCartOutlined />
                {outOfStock ? 'Hết hàng' : addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
              </button>
              <Link to="/products" className="btn-secondary justify-center rounded-2xl px-5 py-4">
                <ArrowLeftOutlined />
                Quay lại sản phẩm
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-900">
                  <CheckCircleFilled className="text-orange-600" />
                  <p className="font-bold">Cam kết chính hãng</p>
                </div>
                <p className="text-sm text-slate-500">Mỗi đôi giày đều được lấy từ nguồn uy tín và kiểm tra chất lượng trước khi giao.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-900">
                  <CheckCircleFilled className="text-orange-600" />
                  <p className="font-bold">Hỗ trợ giao hàng nhanh</p>
                </div>
                <p className="text-sm text-slate-500">Giao hàng toàn quốc nhanh chóng cùng hỗ trợ tư vấn size và sản phẩm.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-panel p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">Mô tả sản phẩm</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {sanitizeText(product.description || 'Hiện chưa có mô tả chi tiết cho sản phẩm này.')}
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">Thông tin nhanh</h2>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <span className="font-semibold text-slate-500">Thương hiệu</span>
                <span className="font-bold text-slate-950">{product.brand}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <span className="font-semibold text-slate-500">Danh mục</span>
                <span className="font-bold text-slate-950">{product.category}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <span className="font-semibold text-slate-500">Đã bán</span>
                <span className="font-bold text-slate-950">{product.sold || 0}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <span className="font-semibold text-slate-500">Lượt xem</span>
                <span className="font-bold text-slate-950">{formattedViews}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-slate-500">Mã sản phẩm</span>
                <span className="font-mono text-xs font-bold text-slate-950">{product._id}</span>
              </div>
            </div>
          </div>
        </div>

        <ProductSection
          title="Sản phẩm liên quan"
          subtitle="Những mẫu sneaker cùng danh mục và cùng phong cách dành cho bạn."
          products={relatedProducts}
          loading={false}
          error=""
          viewAllLink={product.category ? `/products?category=${product.category}` : '/products'}
        />
      </div>
    </div>
  );
}

export default ProductDetailPage;
