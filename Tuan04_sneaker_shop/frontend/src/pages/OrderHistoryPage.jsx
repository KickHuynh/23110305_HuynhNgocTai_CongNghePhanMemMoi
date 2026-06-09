import { ArrowRightOutlined, HistoryOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import orderApi from '../api/orderApi';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  extractApiData,
  formatCurrency,
  formatDateTime,
  getOrderStatusBadgeClass,
  getOrderStatusLabel,
  getPaymentStatusLabel,
} from '../utils/shop';

const extractOrders = (response) => {
  const payload = extractApiData(response, {});
  return Array.isArray(payload?.orders) ? payload.orders : [];
};

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Tải lịch sử đơn hàng của người dùng khi trang được mở lần đầu.
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await orderApi.getMyOrders();
        setOrders(extractOrders(response));
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Không thể tải lịch sử đơn hàng lúc này.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Tính nhanh số đơn đang xử lý và tổng giá trị đơn hàng đã tạo.
  const summary = useMemo(() => {
    const activeCount = orders.filter((order) =>
      ['new', 'confirmed', 'preparing', 'shipping', 'cancel_requested'].includes(order.status)
    ).length;
    const totalSpent = orders.reduce((total, order) => total + Number(order.pricing?.total || 0), 0);

    return {
      activeCount,
      totalSpent,
    };
  }, [orders]);

  if (loading) {
    return (
      <div className="page-shell pb-16">
        <div className="content-shell py-10">
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="glass-panel p-5">
                <div className="space-y-3">
                  <div className="skeleton-block h-5 w-24 rounded-full" />
                  <div className="skeleton-block h-10 w-2/3 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="glass-panel p-6">
                <div className="space-y-4">
                  <div className="skeleton-block h-5 w-28 rounded-full" />
                  <div className="skeleton-block h-8 w-full" />
                  <div className="skeleton-block h-12 w-full rounded-2xl" />
                </div>
              </div>
            ))}
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
            title="Không thể tải đơn hàng"
            message={error}
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

  if (orders.length === 0) {
    return (
      <div className="page-shell pb-16">
        <div className="content-shell py-16">
          <EmptyState
            icon={<HistoryOutlined />}
            title="Chưa có đơn hàng"
            description="Lịch sử đặt hàng COD sẽ xuất hiện tại đây sau khi bạn hoàn tất đơn sneaker đầu tiên."
            minHeight="min-h-[420px]"
            action={
              <Link to="/products" className="btn-primary">
                Bắt đầu mua sắm
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
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-600">Theo dõi đơn hàng</p>
          <h1 className="section-heading mt-3">Lịch sử mua hàng</h1>
          <p className="section-copy mt-3 max-w-2xl">
            Kiểm tra tổng tiền, trạng thái COD và tiến độ giao hàng trong một giao diện rõ ràng.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="glass-panel p-5">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-600">Tổng đơn hàng</p>
            <p className="mt-3 text-3xl font-bold text-slate-950">{orders.length}</p>
          </div>
          <div className="glass-panel p-5">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-600">Đơn đang xử lý</p>
            <p className="mt-3 text-3xl font-bold text-slate-950">{summary.activeCount}</p>
          </div>
          <div className="glass-panel p-5">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-600">Tổng giá trị</p>
            <p className="mt-3 text-3xl font-bold text-slate-950">{formatCurrency(summary.totalSpent)}</p>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {orders.map((order) => (
            <div key={order._id} className="glass-panel p-6 sm:p-7">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-white">
                      Đơn hàng
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${getOrderStatusBadgeClass(order.status)}`}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-slate-950">
                    #{String(order._id).slice(-8).toUpperCase()}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                    <span>Ngày đặt: {formatDateTime(order.createdAt)}</span>
                    <span>Sản phẩm: {order.items?.length || 0}</span>
                    <span>Thanh toán: {order.payment?.method || 'COD'}</span>
                    <span>Trạng thái thanh toán: {getPaymentStatusLabel(order.payment?.status)}</span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:min-w-[360px]">
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Tổng đơn</p>
                    <p className="mt-3 text-2xl font-bold text-orange-600">{formatCurrency(order.pricing?.total || 0)}</p>
                  </div>
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Thao tác</p>
                    <Link to={`/orders/${order._id}`} className="mt-3 inline-flex items-center gap-2 font-bold text-slate-950 transition hover:text-orange-600">
                      Xem chi tiết
                      <ArrowRightOutlined />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderHistoryPage;
