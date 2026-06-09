import {
  ArrowRightOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cartApi from '../api/cartApi';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import QuantitySelector from '../components/common/QuantitySelector';
import {
  createPlaceholderImage,
  extractApiData,
  formatCurrency,
  sanitizeText,
} from '../utils/shop';

const emptyCart = {
  items: [],
  totalItems: 0,
  subtotal: 0,
};

const normalizeCart = (cart) => ({
  ...emptyCart,
  ...cart,
  items: Array.isArray(cart?.items) ? cart.items : [],
});

const extractCart = (response) => normalizeCart(extractApiData(response, {})?.cart);

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingItemId, setProcessingItemId] = useState('');
  const [clearingCart, setClearingCart] = useState(false);

  const hasUnavailableItems = cart.items.some(
    (item) =>
      Number(item.stockSnapshot || 0) <= 0 ||
      Number(item.quantity || 0) > Number(item.stockSnapshot || 0)
  );

  // Tải lại giỏ hàng từ backend sau các thao tác cập nhật hoặc khi cần đồng bộ.
  const fetchCart = async ({ showLoading = true } = {}) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError('');
      const response = await cartApi.getCart();
      setCart(extractCart(response));
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Không thể tải giỏ hàng lúc này.');
      setCart(emptyCart);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Tải giỏ hàng khi người dùng mở trang cart lần đầu.
  useEffect(() => {
    let isActive = true;

    const loadCart = async () => {
      try {
        const response = await cartApi.getCart();

        if (!isActive) {
          return;
        }

        setError('');
        setCart(extractCart(response));
      } catch (apiError) {
        if (!isActive) {
          return;
        }

        setError(apiError.response?.data?.message || 'Không thể tải giỏ hàng lúc này.');
        setCart(emptyCart);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadCart();

    return () => {
      isActive = false;
    };
  }, []);

  // Gửi số lượng mới lên backend và đồng bộ lại giỏ hàng nếu có thay đổi.
  const handleQuantityChange = async (itemId, nextQuantity, currentQuantity) => {
    if (nextQuantity === currentQuantity) {
      return;
    }

    try {
      setProcessingItemId(itemId);
      const response = await cartApi.updateCartItem(itemId, {
        quantity: nextQuantity,
      });
      setCart(extractCart(response));
    } catch (apiError) {
      message.error(apiError.response?.data?.message || 'Không thể cập nhật sản phẩm trong giỏ hàng lúc này.');
      await fetchCart({ showLoading: false });
    } finally {
      setProcessingItemId('');
    }
  };

  // Xóa một dòng sản phẩm khỏi giỏ hàng hiện tại.
  const handleRemoveItem = async (itemId) => {
    try {
      setProcessingItemId(itemId);
      const response = await cartApi.removeCartItem(itemId);
      setCart(extractCart(response));
      message.success('Đã xóa sản phẩm khỏi giỏ hàng.');
    } catch (apiError) {
      message.error(apiError.response?.data?.message || 'Không thể xóa sản phẩm khỏi giỏ hàng lúc này.');
    } finally {
      setProcessingItemId('');
    }
  };

  // Xóa toàn bộ giỏ hàng sau khi người dùng xác nhận lại.
  const handleClearCart = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      return;
    }

    try {
      setClearingCart(true);
      const response = await cartApi.clearCart();
      setCart(extractCart(response));
      message.success('Đã xóa toàn bộ giỏ hàng.');
    } catch (apiError) {
      message.error(apiError.response?.data?.message || 'Không thể xóa giỏ hàng lúc này.');
    } finally {
      setClearingCart(false);
    }
  };

  if (loading) {
    return (
      <div className="page-shell pb-16">
        <div className="content-shell py-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="glass-panel p-5">
                  <div className="flex gap-4">
                    <div className="skeleton-block h-28 w-28 rounded-3xl" />
                    <div className="flex-1 space-y-3">
                      <div className="skeleton-block h-5 w-28 rounded-full" />
                      <div className="skeleton-block h-8 w-2/3" />
                      <div className="skeleton-block h-12 w-40 rounded-2xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-panel p-6">
              <div className="space-y-4">
                <div className="skeleton-block h-5 w-24 rounded-full" />
                <div className="skeleton-block h-10 w-full rounded-2xl" />
                <div className="skeleton-block h-10 w-full rounded-2xl" />
                <div className="skeleton-block h-12 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell pb-16">
        <div className="content-shell py-16">
          <ErrorMessage
            title="Không thể tải giỏ hàng"
            message={error}
            minHeight="min-h-[420px]"
            action={
              <button type="button" onClick={() => fetchCart()} className="btn-primary">
                <ReloadOutlined />
                Thử lại
              </button>
            }
          />
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="page-shell pb-16">
        <div className="content-shell py-16">
          <EmptyState
            icon={<ShoppingCartOutlined />}
            title="Giỏ hàng đang trống"
            description="Hãy chọn vài đôi sneaker nổi bật, sản phẩm sẽ xuất hiện ở đây để bạn đặt hàng COD."
            minHeight="min-h-[420px]"
            action={
              <Link to="/products" className="btn-primary">
                Tiếp tục mua sắm
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell pb-16">
      <div className="content-shell py-8">
        <div className="glass-panel overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(255,69,0,0.14),_transparent_24%),linear-gradient(135deg,_rgba(255,255,255,0.96)_0%,_rgba(255,247,237,0.95)_100%)] p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-600">Giỏ hàng của tôi</p>
          <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="section-heading">Sẵn sàng để đặt hàng</h1>
              <p className="section-copy mt-3 max-w-2xl">
                Kiểm tra lại kích cỡ, màu sắc và số lượng trước khi chuyển sang bước đặt hàng COD.
              </p>
            </div>
            <div className="rounded-3xl border border-orange-100 bg-white/90 px-5 py-4 shadow-lg shadow-orange-600/10">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Tổng quan giỏ hàng</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {cart.totalItems} sản phẩm
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.18fr_0.82fr]">
          <div className="space-y-5">
            {cart.items.map((item) => {
              const itemSubtotal = Number(item.price || 0) * Number(item.quantity || 0);
              const isProcessing = processingItemId === item._id;
              const stockShortage = Number(item.quantity || 0) > Number(item.stockSnapshot || 0);

              return (
                <div key={item._id} className="glass-panel p-5 sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row">
                    <div className="overflow-hidden rounded-[24px] bg-slate-100 lg:h-32 lg:w-32">
                      <img
                        src={item.image || createPlaceholderImage(item.name)}
                        alt={sanitizeText(item.name)}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-600">Sản phẩm</p>
                          <h2 className="mt-2 text-2xl font-bold text-slate-950">{sanitizeText(item.name)}</h2>
                          <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold text-slate-500">
                            <span className="rounded-full bg-slate-100 px-3 py-1">Kích cỡ {item.size}</span>
                            <span className="rounded-full bg-slate-100 px-3 py-1">{item.color}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={isProcessing}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <DeleteOutlined />
                          Xóa
                        </button>
                      </div>

                      <div className="grid gap-4 xl:grid-cols-[auto_auto_1fr] xl:items-end">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Đơn giá</p>
                          <p className="mt-2 text-xl font-bold text-orange-600">{formatCurrency(item.price)}</p>
                        </div>

                        <div>
                          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Số lượng</p>
                          <QuantitySelector
                            value={item.quantity}
                            onChange={(nextQuantity) => handleQuantityChange(item._id, nextQuantity, item.quantity)}
                            min={1}
                            max={Math.max(Number(item.stockSnapshot || 1), 1)}
                            disabled={isProcessing}
                          />
                        </div>

                        <div className="xl:text-right">
                          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Tạm tính sản phẩm</p>
                          <p className="mt-2 text-2xl font-bold text-slate-950">{formatCurrency(itemSubtotal)}</p>
                        </div>
                      </div>

                      {Number(item.stockSnapshot || 0) <= 0 ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                          Sản phẩm này hiện đã hết hàng. Vui lòng xóa trước khi đặt hàng.
                        </div>
                      ) : stockShortage ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                          Tồn kho hiện tại đã thay đổi. Số lượng có thể mua: {item.stockSnapshot}.
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                          Sản phẩm đủ điều kiện để thanh toán. Số lượng còn lại: {item.stockSnapshot}.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="glass-panel p-6 sm:p-7">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-orange-600">Tóm tắt giỏ hàng</p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <span className="font-semibold text-slate-500">Tổng sản phẩm</span>
                  <span className="text-lg font-bold text-slate-950">{cart.totalItems}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <span className="font-semibold text-slate-500">Tạm tính</span>
                  <span className="text-lg font-bold text-slate-950">{formatCurrency(cart.subtotal)}</span>
                </div>
                <div className="rounded-3xl border border-orange-100 bg-orange-50/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-700">Lưu ý vận chuyển</p>
                  <p className="mt-2 text-sm leading-7 text-orange-800">
                    Phí vận chuyển sẽ được tính ở bước thanh toán. Đơn từ {formatCurrency(1000000)} sẽ được miễn phí giao hàng.
                  </p>
                </div>
                {hasUnavailableItems && (
                  <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
                    Vui lòng cập nhật các sản phẩm không khả dụng trước khi tiếp tục đặt hàng.
                  </div>
                )}
              </div>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  disabled={hasUnavailableItems}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-bold transition ${
                    hasUnavailableItems
                      ? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400'
                      : 'bg-orange-600 text-white shadow-lg shadow-orange-600/25 hover:-translate-y-0.5 hover:bg-orange-700'
                  }`}
                >
                  Tiến hành đặt hàng
                  <ArrowRightOutlined />
                </button>
                <button
                  type="button"
                  onClick={handleClearCart}
                  disabled={clearingCart}
                  className="btn-secondary w-full justify-center rounded-2xl px-5 py-4 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {clearingCart ? 'Đang xóa giỏ hàng...' : 'Xóa giỏ hàng'}
                </button>
                <Link to="/products" className="btn-secondary w-full justify-center rounded-2xl px-5 py-4">
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
