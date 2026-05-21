import { useNavigate } from 'react-router-dom';
import { ArrowRightOutlined, StarFilled } from '@ant-design/icons';
import { createPlaceholderImage, formatCurrency, getPrimaryImage, hasSalePrice } from '../utils/shop';

const getBadges = (product) => {
  const badges = [];

  if (product?.stock <= 0) {
    badges.push({ label: 'OUT OF STOCK', className: 'bg-slate-950 text-white' });
    return badges;
  }

  if (hasSalePrice(product)) {
    badges.push({ label: 'SALE', className: 'bg-orange-600 text-white' });
  }

  if (product?.isNew || product?.isNewProduct) {
    badges.push({ label: 'NEW', className: 'bg-sky-500 text-white' });
  }

  if (product?.isBestSeller) {
    badges.push({ label: 'BEST SELLER', className: 'bg-amber-300 text-slate-950' });
  }

  return badges.slice(0, 3);
};

function ProductCard({ product }) {
  const navigate = useNavigate();
  const badges = getBadges(product);
  const outOfStock = Number(product?.stock) <= 0;
  const displayPrice = hasSalePrice(product) ? product.salePrice : product.price;
  const formattedViews = Number(product?.views || 0).toLocaleString('vi-VN');

  const handleNavigate = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <article
      onClick={handleNavigate}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleNavigate();
        }
      }}
      role="button"
      tabIndex={0}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10"
    >
      <div className="relative aspect-[4/4.25] overflow-hidden bg-[linear-gradient(135deg,_#f8fafc,_#e2e8f0)]">
        <img
          src={getPrimaryImage(product)}
          alt={product?.name}
          onError={(event) => {
            event.currentTarget.src = createPlaceholderImage(product?.name || 'SneakerHub');
          }}
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
            outOfStock ? 'grayscale-[0.25] opacity-80' : ''
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge.label}
              className={`rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.24em] ${badge.className}`}
            >
              {badge.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.26em] text-orange-600">
              {product?.brand || 'SneakerHub'}
            </p>
            <h3 className="line-clamp-2 text-lg font-bold leading-tight text-slate-950">{product?.name}</h3>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
            <StarFilled />
            <span>{product?.rating || 5}</span>
          </div>
        </div>

        <div className="mb-5 space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
            <span>{product?.category || 'Lifestyle'}</span>
            <span>🔥 {product?.sold || 0} sold</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className={`font-semibold ${outOfStock ? 'text-red-500' : 'text-emerald-600'}`}>
              {outOfStock ? 'Out of stock' : `In stock: ${product?.stock || 0}`}
            </span>
            <span className="text-slate-500">
              {product?.views !== undefined && product?.views !== null ? `👁 ${formattedViews} views` : `Sizes: ${product?.sizes?.length || 0}`}
            </span>
          </div>
        </div>

        <div className="mt-auto border-t border-slate-100 pt-4">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-2xl font-bold text-slate-950">{formatCurrency(displayPrice)}</p>
              {hasSalePrice(product) && (
                <p className="text-sm font-semibold text-slate-400 line-through">{formatCurrency(product.price)}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleNavigate();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold !text-white transition duration-300 hover:bg-orange-600"
          >
            <span className="!text-white">View Detail</span>
            <ArrowRightOutlined className="!text-white" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
