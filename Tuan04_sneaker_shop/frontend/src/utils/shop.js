import { formatCurrency } from './formatCurrency';

export { formatCurrency };

// Tách phần dữ liệu hữu ích từ nhiều kiểu phản hồi API khác nhau.
export const extractApiData = (response, fallback = []) => {
  if (response?.data?.data !== undefined) {
    return response.data.data;
  }

  if (response?.data !== undefined) {
    return response.data;
  }

  return fallback;
};

// Chuẩn hóa danh sách sản phẩm trả về cho các trang danh mục và tìm kiếm.
export const extractProductList = (response, fallback = []) => {
  const payload = extractApiData(response, fallback);

  if (Array.isArray(payload?.products)) {
    return payload.products;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return fallback;
};

// Lấy thông tin phân trang đi kèm danh sách sản phẩm nếu có.
export const extractPagination = (response, fallback = {}) => {
  const payload = extractApiData(response, null);

  if (payload?.pagination) {
    return payload.pagination;
  }

  return fallback;
};

export const getUserDisplayName = (user) =>
  user?.fullName || user?.name || user?.username || user?.email || 'Khách';

export const getUserRole = (user) => {
  if (user?.role === 'admin') {
    return 'Quản trị viên';
  }

  if (user?.role === 'student') {
    return 'Sinh viên';
  }

  return 'Thành viên';
};

export const getProductImages = (product) =>
  Array.isArray(product?.images) && product.images.length > 0 ? product.images : [];

export const getPrimaryImage = (product) =>
  getProductImages(product)[0] ||
  createPlaceholderImage(product?.name || 'Sneaker');

export const hasSalePrice = (product) =>
  Number(product?.salePrice) > 0 &&
  Number(product?.salePrice) < Number(product?.price);

export const getDisplayPrice = (product) =>
  hasSalePrice(product)
    ? Number(product.salePrice)
    : Number(product?.price || 0);

export const getProductIdentifier = (product) =>
  product?.slug || product?._id || product?.id || '';

export const getProductRoute = (product) =>
  `/products/${getProductIdentifier(product)}`;

// Ánh xạ trạng thái đơn hàng sang nhãn hiển thị và màu badge ở frontend.
const ORDER_STATUS_META = {
  new: {
    label: 'Đơn hàng mới',
    badgeClass: 'border-orange-200 bg-orange-50 text-orange-700',
  },
  confirmed: {
    label: 'Đã xác nhận đơn hàng',
    badgeClass: 'border-sky-200 bg-sky-50 text-sky-700',
  },
  preparing: {
    label: 'Shop đang chuẩn bị hàng',
    badgeClass: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  shipping: {
    label: 'Đang giao hàng',
    badgeClass: 'border-violet-200 bg-violet-50 text-violet-700',
  },
  delivered: {
    label: 'Đã giao thành công',
    badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  cancelled: {
    label: 'Đã hủy đơn hàng',
    badgeClass: 'border-red-200 bg-red-50 text-red-700',
  },
  cancel_requested: {
    label: 'Đã gửi yêu cầu hủy đơn cho shop',
    badgeClass: 'border-rose-200 bg-rose-50 text-rose-700',
  },
};

export const getOrderStatusMeta = (status) =>
  ORDER_STATUS_META[status] || {
    label: status || 'Không xác định',
    badgeClass: 'border-slate-200 bg-slate-50 text-slate-700',
  };

export const getOrderStatusLabel = (status) =>
  getOrderStatusMeta(status).label;

export const getOrderStatusBadgeClass = (status) =>
  getOrderStatusMeta(status).badgeClass;

export const getPaymentStatusLabel = (status) => {
  if (status === 'paid') {
    return 'Đã thanh toán';
  }

  if (status === 'unpaid') {
    return 'Chưa thanh toán';
  }

  return status || 'Không xác định';
};

export const formatDateTime = (value) => {
  if (!value) {
    return '--';
  }

  const parsedValue = new Date(value);

  if (Number.isNaN(parsedValue.getTime())) {
    return '--';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedValue);
};

// Tính mốc thời gian cuối cùng người dùng còn được phép hủy trực tiếp.
export const getOrderCancellationDeadline = (order) => {
  if (!order?.createdAt) {
    return null;
  }

  return new Date(new Date(order.createdAt).getTime() + 30 * 60 * 1000);
};

// Kiểm tra đơn hàng còn nằm trong cửa sổ hủy trực tiếp hay không.
export const isOrderWithinCancellationWindow = (order) => {
  const deadline = getOrderCancellationDeadline(order);

  return Boolean(deadline) && deadline.getTime() > Date.now();
};

// Tạo ảnh placeholder khi sản phẩm chưa có ảnh từ backend.
export const createPlaceholderImage = (label = 'SneakerHub') => {
  const safeLabel = String(label)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#111827" />
          <stop offset="100%" stop-color="#ff4500" />
        </linearGradient>
      </defs>
      <rect width="1200" height="1200" fill="url(#bg)" rx="48" />
      <circle cx="930" cy="220" r="170" fill="rgba(255,255,255,0.12)" />
      <circle cx="240" cy="940" r="200" fill="rgba(255,255,255,0.08)" />
      <text x="100" y="580" fill="#ffffff" font-family="Arial, sans-serif" font-size="84" font-weight="700">${safeLabel}</text>
      <text x="100" y="690" fill="#fdba74" font-family="Arial, sans-serif" font-size="42" font-weight="600">Bo suu tap sneaker cao cap</text>
    </svg>`
  )}`;
};

export const normalizeBooleanQuery = (value) => {
  if (value === true || value === 'true') return 'true';
  if (value === false || value === 'false') return 'false';
  return '';
};

// Loại bỏ các tham số rỗng trước khi gửi bộ lọc sản phẩm lên API.
export const cleanFilterParams = (filters = {}) =>
  Object.entries(filters).reduce((result, [key, value]) => {
    if (value !== '' && value !== undefined && value !== null && value !== false) {
      result[key] = value;
    }

    return result;
  }, {});

// Làm sạch chuỗi lỗi font hoặc ký tự lạ trước khi hiển thị ra giao diện.
export const sanitizeText = (value = '') =>
  String(value)
    .replaceAll('Ã¢â‚¬â„¢', "'")
    .replaceAll('Ã¢â‚¬Å“', '"')
    .replaceAll('Ã¢â‚¬Â', '"')
    .replaceAll('Ã¢â‚¬â€', '-')
    .replaceAll('Ã¢â‚¬â€œ', '-')
    .replaceAll('Ã‚', '')
    .trim();
