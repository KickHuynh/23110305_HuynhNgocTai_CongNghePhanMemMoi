import {
  CheckCircleFilled,
  ClockCircleOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import orderApi from '../api/orderApi';
import ErrorMessage from '../components/common/ErrorMessage';
import { translateMessage } from '../utils/messages';
import {
  createPlaceholderImage,
  extractApiData,
  formatCurrency,
  formatDateTime,
  getOrderCancellationDeadline,
  getOrderStatusBadgeClass,
  getOrderStatusLabel,
  getPaymentStatusLabel,
  isOrderWithinCancellationWindow,
  sanitizeText,
} from '../utils/shop';

const extractOrder = (response) => extractApiData(response, {})?.order || null;

const getChangedByLabel = (changedBy) => {
  if (changedBy === 'system') {
    return 'hệ thống';
  }

  if (changedBy === 'admin') {
    return 'quản trị viên';
  }

  if (changedBy === 'user') {
    return 'người dùng';
  }

  return changedBy || 'không xác định';
};

function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await orderApi.getOrderById(orderId);
        setOrder(extractOrder(response));
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Không thể tải đơn hàng này lúc này.');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const canCancelDirectly = useMemo(() => {
    return order && ['new', 'confirmed'].includes(order.status) && isOrderWithinCancellationWindow(order);
  }, [order]);

  const canRequestCancellation = order?.status === 'preparing';
  const cancellationDeadline = getOrderCancellationDeadline(order);
  const statusHistory = Array.isArray(order?.statusHistory) ? order.statusHistory : [];

  const handleCancel = async () => {
    const confirmationMessage = canRequestCancellation
      ? 'Bạn có muốn gửi yêu cầu hủy đơn đến shop không?'
      : 'Bạn có chắc muốn hủy đơn hàng này không?';

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    try {
      setCancelSubmitting(true);
      const response = await orderApi.cancelOrder(order._id, {
        reason: cancelReason,
      });
      const updatedOrder = extractOrder(response);
      setOrder(updatedOrder);
      setCancelReason('');
      message.success(response?.data?.message || 'Yêu cầu hủy đơn đã được xử lý.');
    } catch (apiError) {
      message.error(apiError.response?.data?.message || 'Không thể xử lý yêu cầu hủy đơn lúc này.');
    } finally {
      setCancelSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-shell pb-16">
        <div className="content-shell py-10">
          <div className="space-y-6">
            <div className="glass-panel p-6">
              <div className="space-y-4">
                <div className="skeleton-block h-5 w-24 rounded-full" />
                <div className="skeleton-block h-10 w-2/3 rounded-2xl" />
                <div className="skeleton-block h-20 w-full rounded-3xl" />
              </div>
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="glass-panel p-6">
                <div className="space-y-4">
                  <div className="skeleton-block h-32 w-full rounded-3xl" />
                  <div className="skeleton-block h-32 w-full rounded-3xl" />
                </div>
              </div>
              <div className="glass-panel p-6">
                <div className="space-y-4">
                  <div className="skeleton-block h-24 w-full rounded-3xl" />
                  <div className="skeleton-block h-24 w-full rounded-3xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page-shell pb-16">
        <div className="content-shell py-16">
          <ErrorMessage
            title={error || 'Không tìm thấy đơn hàng'}
            message="Đơn hàng bạn đang xem không khả dụng hoặc không thuộc về tài khoản này."
            minHeight="min-h-[420px]"
            action={
              <Link to="/orders" className="btn-primary">
                Quay lại đơn hàng
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
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-600">Chi tiết đơn hàng</p>
              <h1 className="section-heading mt-3">Đơn hàng #{String(order._id).slice(-8).toUpperCase()}</h1>
              <p className="section-copy mt-3 max-w-2xl">
                Theo dõi trạng thái, tóm tắt COD và thông tin giao hàng cho đơn sneaker của bạn.
              </p>
            </div>

            <div className={`rounded-3xl border px-5 py-4 ${getOrderStatusBadgeClass(order.status)}`}>
              <p className="text-xs font-bold uppercase tracking-[0.24em]">Trạng thái hiện tại</p>
              <p className="mt-2 text-2xl font-bold">{getOrderStatusLabel(order.status)}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
            <span>Ngày đặt: {formatDateTime(order.createdAt)}</span>
            <span>Thanh toán: {order.payment?.method || 'COD'}</span>
            <span>Trạng thái thanh toán: {getPaymentStatusLabel(order.payment?.status)}</span>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <section className="glass-panel p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <ShoppingOutlined className="text-lg" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-orange-600">Sản phẩm trong đơn</p>
                  <h2 className="text-2xl font-bold text-slate-950">Các đôi sneaker đã đặt</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {order.items?.map((item, index) => (
                  <div key={`${item.product}-${index}`} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="h-24 w-24 overflow-hidden rounded-2xl bg-white">
                        <img
                          src={item.image || createPlaceholderImage(item.name)}
                          alt={sanitizeText(item.name)}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-bold text-slate-950">{sanitizeText(item.name)}</h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-sm font-semibold text-slate-500">
                          <span className="rounded-full bg-white px-3 py-1">Kích cỡ {item.size}</span>
                          <span className="rounded-full bg-white px-3 py-1">{item.color}</span>
                          <span className="rounded-full bg-white px-3 py-1">SL {item.quantity}</span>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-slate-500">
                            Đơn giá {formatCurrency(item.price)}
                          </span>
                          <span className="text-lg font-bold text-slate-950">
                            {formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-panel p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <ClockCircleOutlined className="text-lg" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-orange-600">Lịch sử trạng thái</p>
                  <h2 className="text-2xl font-bold text-slate-950">Timeline theo dõi đơn</h2>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {statusHistory.map((entry, index) => {
                  const isLast = index === statusHistory.length - 1;

                  return (
                    <div key={`${entry.status}-${entry.changedAt}-${index}`} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span
                          className={`mt-1 h-4 w-4 rounded-full border-4 ${
                            isLast ? 'border-orange-600 bg-orange-600' : 'border-slate-300 bg-white'
                          }`}
                        />
                        {!isLast && <span className="mt-2 h-full w-px bg-slate-200" />}
                      </div>
                      <div className="min-w-0 flex-1 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-lg font-bold text-slate-950">{getOrderStatusLabel(entry.status)}</p>
                            <p className="mt-1 text-sm text-slate-500">{translateMessage(entry.note || 'Status updated')}</p>
                          </div>
                          <div className="text-sm font-semibold text-slate-500">{formatDateTime(entry.changedAt)}</div>
                        </div>
                        <p className="mt-3 text-xs font-bold uppercase tracking-[0.24em] text-orange-600">
                          Cập nhật bởi {getChangedByLabel(entry.changedBy)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <section className="glass-panel p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <EnvironmentOutlined className="text-lg" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-orange-600">Thông tin giao hàng</p>
                  <h2 className="text-2xl font-bold text-slate-950">Địa chỉ nhận hàng</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <p className="font-bold text-slate-950">{order.shippingAddress?.fullName}</p>
                  <p className="mt-2 text-slate-500">{order.shippingAddress?.phone}</p>
                  <p className="mt-2 leading-7 text-slate-500">
                    {[
                      order.shippingAddress?.addressLine,
                      order.shippingAddress?.ward,
                      order.shippingAddress?.district,
                      order.shippingAddress?.city,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  {order.shippingAddress?.note && (
                    <p className="mt-3 rounded-2xl bg-white px-3 py-2 text-slate-600">Ghi chú: {order.shippingAddress.note}</p>
                  )}
                </div>
              </div>
            </section>

            <section className="glass-panel p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-orange-600">Tóm tắt chi phí</p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-500">Tạm tính</span>
                  <span className="font-bold text-slate-950">{formatCurrency(order.pricing?.subtotal || 0)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-500">Phí vận chuyển</span>
                  <span className="font-bold text-slate-950">{formatCurrency(order.pricing?.shippingFee || 0)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-500">Giảm giá</span>
                  <span className="font-bold text-slate-950">{formatCurrency(order.pricing?.discount || 0)}</span>
                </div>
                <div className="rounded-3xl border border-orange-100 bg-orange-50/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-bold uppercase tracking-[0.24em] text-orange-700">Tổng tiền</span>
                    <span className="text-2xl font-bold text-orange-700">{formatCurrency(order.pricing?.total || 0)}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="glass-panel p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-orange-600">Hủy đơn hàng</p>

              {canCancelDirectly && (
                <div className="mt-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-7 text-emerald-700">
                  Bạn có thể hủy trực tiếp đơn hàng này đến trước {formatDateTime(cancellationDeadline)}.
                </div>
              )}

              {!canCancelDirectly && ['new', 'confirmed'].includes(order.status) && cancellationDeadline && (
                <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-700">
                  Mốc hủy đơn trong 30 phút đã kết thúc vào lúc {formatDateTime(cancellationDeadline)}.
                </div>
              )}

              {canRequestCancellation && (
                <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm leading-7 text-rose-700">
                  Đơn hàng đang ở giai đoạn chuẩn bị. Bạn chỉ có thể gửi yêu cầu hủy đơn đến shop.
                </div>
              )}

              {order.status === 'cancel_requested' && (
                <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm leading-7 text-rose-700">
                  Yêu cầu hủy đơn đã được gửi đến shop và đang chờ xử lý.
                </div>
              )}

              {canCancelDirectly || canRequestCancellation ? (
                <div className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="cancelReason" className="mb-2 block text-sm font-bold text-slate-900">
                      Lý do hủy đơn
                    </label>
                    <textarea
                      id="cancelReason"
                      rows={4}
                      value={cancelReason}
                      onChange={(event) => setCancelReason(event.target.value)}
                      className="field-input resize-none"
                      placeholder="Muốn đổi size, sai địa chỉ, thay đổi quyết định..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={cancelSubmitting}
                    className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {cancelSubmitting
                      ? 'Đang xử lý...'
                      : canRequestCancellation
                        ? 'Gửi yêu cầu hủy đơn'
                        : 'Hủy đơn hàng'}
                  </button>
                </div>
              ) : order.status !== 'cancel_requested' ? (
                <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-500">
                  Hiện không thể hủy đơn ở trạng thái này.
                </div>
              ) : null}

              {order.cancelInfo?.reason && (
                <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircleFilled className="mt-1 text-orange-600" />
                    <div>
                      <p className="font-bold text-slate-950">Ghi chú hủy đơn</p>
                      <p className="mt-2 text-sm leading-7 text-slate-500">{order.cancelInfo.reason}</p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
