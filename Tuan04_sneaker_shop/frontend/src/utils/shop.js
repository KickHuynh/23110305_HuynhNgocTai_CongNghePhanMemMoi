import { formatCurrency } from './formatCurrency';

export { formatCurrency };

export const extractApiData = (response, fallback = []) => {
  if (response?.data?.data !== undefined) {
    return response.data.data;
  }

  if (response?.data !== undefined) {
    return response.data;
  }

  return fallback;
};

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

export const extractPagination = (response, fallback = {}) => {
  const payload = extractApiData(response, null);

  if (payload?.pagination) {
    return payload.pagination;
  }

  return fallback;
};

export const getUserDisplayName = (user) =>
  user?.fullName || user?.name || user?.username || user?.email || 'Guest';

export const getUserRole = (user) => user?.role || 'member';

export const getProductImages = (product) =>
  Array.isArray(product?.images) && product.images.length > 0 ? product.images : [];

export const getPrimaryImage = (product) => getProductImages(product)[0] || createPlaceholderImage(product?.name || 'Sneaker');

export const hasSalePrice = (product) =>
  Number(product?.salePrice) > 0 && Number(product?.salePrice) < Number(product?.price);

export const getDisplayPrice = (product) =>
  hasSalePrice(product) ? Number(product.salePrice) : Number(product?.price || 0);

export const getProductIdentifier = (product) => product?.slug || product?._id || product?.id || '';

export const getProductRoute = (product) => `/products/${getProductIdentifier(product)}`;

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
      <text x="100" y="690" fill="#fdba74" font-family="Arial, sans-serif" font-size="42" font-weight="600">Premium Sneaker Collection</text>
    </svg>`
  )}`;
};

export const normalizeBooleanQuery = (value) => {
  if (value === true || value === 'true') return 'true';
  if (value === false || value === 'false') return 'false';
  return '';
};

export const cleanFilterParams = (filters = {}) =>
  Object.entries(filters).reduce((result, [key, value]) => {
    if (value !== '' && value !== undefined && value !== null && value !== false) {
      result[key] = value;
    }
    return result;
  }, {});

export const sanitizeText = (value = '') =>
  String(value)
    .replaceAll('â€™', "'")
    .replaceAll('â€œ', '"')
    .replaceAll('â€', '"')
    .replaceAll('â€”', '-')
    .replaceAll('â€“', '-')
    .replaceAll('Â', '')
    .trim();
