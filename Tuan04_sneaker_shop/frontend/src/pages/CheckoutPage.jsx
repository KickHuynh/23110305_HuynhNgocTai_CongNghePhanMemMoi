import {
  CheckCircleFilled,
  CreditCardOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser } from '../api/authApi';
import cartApi from '../api/cartApi';
import orderApi from '../api/orderApi';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
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

function CheckoutPage() {
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    phone: '',
    addressLine: '',
    ward: '',
    district: '',
    city: 'Thành phố Hồ Chí Minh',
    note: '',
  });

  const hasUnavailableItems = cart.items.some(
    (item) =>
      Number(item.stockSnapshot || 0) <= 0 ||
      Number(item.quantity || 0) > Number(item.stockSnapshot || 0)
  );
  const shippingFee = cart.subtotal < 1000000 ? 30000 : 0;
  const discount = 0;
  const total = cart.subtotal + shippingFee - discount;

  // Tải giỏ hàng để kiểm tra dữ liệu checkout và tính tổng tiền hiện tại.
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await cartApi.getCart();
        setCart(extractCart(response));
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Không thể tải thông tin thanh toán lúc này.');
        setCart(emptyCart);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
      setFormData((current) => ({
        ...current,
        [name]: value,
      }));
  };

  // Gửi thông tin giao hàng để backend tạo đơn COD từ giỏ hàng hiện tại.
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (hasUnavailableItems) {
      message.warning('Vui lòng cập nhật các sản phẩm không khả dụng trước khi đặt hàng.');
      return;
    }

    try {
      setSubmitting(true);

      const response = await orderApi.checkout({
        shippingAddress: formData,
        paymentMethod: 'COD',
      });

      const order = extractApiData(response, {})?.order;
      message.success('Đặt hàng thành công.');
      navigate(order?._id ? `/orders/${order._id}` : '/orders');
    } catch (apiError) {
      message.error(apiError.response?.data?.message || 'Không thể hoàn tất thanh toán lúc này.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-shell pb-16">
        <div className="content-shell py-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="glass-panel p-6">
              <div className="space-y-4">
                <div className="skeleton-block h-5 w-24 rounded-full" />
                <div className="skeleton-block h-12 w-full rounded-2xl" />
                <div className="skeleton-block h-12 w-full rounded-2xl" />
                <div className="skeleton-block h-12 w-full rounded-2xl" />
                <div className="skeleton-block h-32 w-full rounded-3xl" />
              </div>
            </div>
            <div className="glass-panel p-6">
              <div className="space-y-4">
                <div className="skeleton-block h-5 w-24 rounded-full" />
                <div className="skeleton-block h-20 w-full rounded-3xl" />
                <div className="skeleton-block h-20 w-full rounded-3xl" />
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
            title="Không thể mở trang thanh toán"
            message={error}
            minHeight="min-h-[420px]"
            action={
              <Link to="/cart" className="btn-primary">
                Quay lại giỏ hàng
              </Link>
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
            icon={<ShoppingOutlined />}
            title="Giỏ hàng đang trống"
            description="Hãy thêm ít nhất một sản phẩm trước khi chuyển sang bước thanh toán."
            minHeight="min-h-[420px]"
            action={
              <Link to="/products" className="btn-primary">
                Xem sản phẩm
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
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-600">Thanh toán COD</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="section-heading">Hoàn tất đơn hàng sneaker</h1>
              <p className="section-copy mt-3 max-w-2xl">
                Điền thông tin giao hàng, xem lại đơn hàng và xác nhận đặt hàng bằng thanh toán khi nhận hàng.
              </p>
            </div>
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-lg shadow-emerald-500/10">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">Phương thức thanh toán</p>
              <p className="mt-2 text-2xl font-bold text-emerald-800">COD</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <EnvironmentOutlined className="text-lg" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-orange-600">Thông tin giao hàng</p>
                <h2 className="text-2xl font-bold text-slate-950">Chi tiết nhận hàng</h2>
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="mb-2 block text-sm font-bold text-slate-900">
                  Họ và tên
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="field-input"
                  placeholder="Huynh Ngoc Tai"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-bold text-slate-900">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="field-input"
                  placeholder="0900000000"
                />
              </div>

              <div>
                <label htmlFor="city" className="mb-2 block text-sm font-bold text-slate-900">
                  Tỉnh/Thành phố
                </label>
                <input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="field-input"
                  placeholder="Thành phố Hồ Chí Minh"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="addressLine" className="mb-2 block text-sm font-bold text-slate-900">
                  Địa chỉ
                </label>
                <input
                  id="addressLine"
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  required
                  className="field-input"
                  placeholder="Thu Duc, số nhà, tên đường..."
                />
              </div>

              <div>
                <label htmlFor="ward" className="mb-2 block text-sm font-bold text-slate-900">
                  Phường/Xã
                </label>
                <input
                  id="ward"
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  className="field-input"
                  placeholder="Linh Trung"
                />
              </div>

              <div>
                <label htmlFor="district" className="mb-2 block text-sm font-bold text-slate-900">
                  Quận/Huyện
                </label>
                <input
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="field-input"
                  placeholder="Thu Duc"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="note" className="mb-2 block text-sm font-bold text-slate-900">
                  Ghi chú
                </label>
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={4}
                  className="field-input resize-none"
                  placeholder="Gọi trước khi giao, khung giờ nhận, mốc nhận diện..."
                />
              </div>
            </div>

            <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <CreditCardOutlined />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-950">Phương thức thanh toán: Thanh toán khi nhận hàng</p>
                  <p className="text-sm text-slate-500">Ví điện tử có thể được bổ sung sau như một hướng phát triển tiếp theo.</p>
                </div>
              </div>
            </div>

            {hasUnavailableItems && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                Một số sản phẩm trong giỏ hàng không còn đủ số lượng đã chọn. Vui lòng quay lại giỏ hàng trước.
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={submitting || hasUnavailableItems}
                className={`flex-1 rounded-2xl px-5 py-4 text-sm font-bold transition ${
                  submitting || hasUnavailableItems
                    ? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400'
                    : 'bg-orange-600 text-white shadow-lg shadow-orange-600/25 hover:-translate-y-0.5 hover:bg-orange-700'
                }`}
              >
                {submitting ? 'Đang đặt hàng...' : 'Đặt hàng'}
              </button>
              <Link to="/cart" className="btn-secondary justify-center rounded-2xl px-5 py-4">
                Quay lại giỏ hàng
              </Link>
            </div>
          </form>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="glass-panel p-6 sm:p-7">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-orange-600">Tóm tắt đơn hàng</p>
              <div className="mt-6 space-y-4">
                {cart.items.map((item) => (
                  <div key={item._id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-2xl bg-white">
                        <img
                          src={item.image || createPlaceholderImage(item.name)}
                          alt={sanitizeText(item.name)}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-bold text-slate-950">{sanitizeText(item.name)}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Kích cỡ {item.size} | {item.color}
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                          <span className="font-semibold text-slate-500">SL {item.quantity}</span>
                          <span className="font-bold text-slate-950">
                            {formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-500">Tạm tính</span>
                  <span className="font-bold text-slate-950">{formatCurrency(cart.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-500">Phí vận chuyển</span>
                  <span className="font-bold text-slate-950">{shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-500">Giảm giá</span>
                  <span className="font-bold text-slate-950">{formatCurrency(discount)}</span>
                </div>
                <div className="rounded-3xl border border-orange-100 bg-orange-50/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-bold uppercase tracking-[0.24em] text-orange-700">Tổng tiền</span>
                    <span className="text-2xl font-bold text-orange-700">{formatCurrency(total)}</span>
                  </div>
                </div>
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircleFilled className="mt-1 text-emerald-600" />
                    <p className="text-sm leading-7 text-emerald-700">
                      Đơn hàng từ {formatCurrency(1000000)} sẽ được tự động miễn phí vận chuyển.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
