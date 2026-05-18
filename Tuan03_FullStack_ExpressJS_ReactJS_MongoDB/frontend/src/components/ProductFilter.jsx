import { FilterOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';

const sortOptions = [
  { value: 'newest', label: 'Newest arrivals' },
  { value: 'best_seller', label: 'Best sellers' },
  { value: 'price_asc', label: 'Price: Low to high' },
  { value: 'price_desc', label: 'Price: High to low' },
];

function ProductFilter({ filters, setFilters, onApply, onReset, metadata = {}, total = 0 }) {
  const categories = metadata.categories || [];
  const brands = metadata.brands || [];
  const sizes = metadata.sizes || [];
  const colors = metadata.colors || [];

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFilters((current) => ({
      ...current,
      [name]: type === 'checkbox' ? (checked ? 'true' : '') : value,
    }));
  };

  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 lg:sticky lg:top-28">
      <div className="mb-5 flex items-start justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-950">
            <FilterOutlined className="text-orange-600" />
            Filters
          </div>
          <p className="text-sm text-slate-500">{total} products matched your current search.</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500 transition hover:border-orange-300 hover:text-orange-600"
        >
          <ReloadOutlined />
          Reset
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="keyword" className="mb-2 block text-sm font-bold text-slate-900">
            Search keyword
          </label>
          <div className="relative">
            <SearchOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="keyword"
              name="keyword"
              value={filters.keyword || ''}
              onChange={handleChange}
              placeholder="Nike, Adidas, running..."
              className="field-input pl-11"
            />
          </div>
        </div>

        <div>
          <label htmlFor="sort" className="mb-2 block text-sm font-bold text-slate-900">
            Sort by
          </label>
          <select id="sort" name="sort" value={filters.sort || 'newest'} onChange={handleChange} className="field-input">
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-bold text-slate-900">
              Category
            </label>
            <select id="category" name="category" value={filters.category || ''} onChange={handleChange} className="field-input">
              <option value="">All categories</option>
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="brand" className="mb-2 block text-sm font-bold text-slate-900">
              Brand
            </label>
            <select id="brand" name="brand" value={filters.brand || ''} onChange={handleChange} className="field-input">
              <option value="">All brands</option>
              {brands.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="minPrice" className="mb-2 block text-sm font-bold text-slate-900">
              Min price
            </label>
            <input
              id="minPrice"
              name="minPrice"
              type="number"
              min="0"
              value={filters.minPrice || ''}
              onChange={handleChange}
              placeholder="1000000"
              className="field-input"
            />
          </div>

          <div>
            <label htmlFor="maxPrice" className="mb-2 block text-sm font-bold text-slate-900">
              Max price
            </label>
            <input
              id="maxPrice"
              name="maxPrice"
              type="number"
              min="0"
              value={filters.maxPrice || ''}
              onChange={handleChange}
              placeholder="5000000"
              className="field-input"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <label htmlFor="size" className="mb-2 block text-sm font-bold text-slate-900">
              Size
            </label>
            <select id="size" name="size" value={filters.size || ''} onChange={handleChange} className="field-input">
              <option value="">All sizes</option>
              {sizes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="color" className="mb-2 block text-sm font-bold text-slate-900">
              Color
            </label>
            <select id="color" name="color" value={filters.color || ''} onChange={handleChange} className="field-input">
              <option value="">All colors</option>
              {colors.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm font-bold text-slate-900">In stock only</p>
            <p className="text-xs text-slate-500">Hide sneakers that are currently unavailable.</p>
          </div>
          <input
            name="inStock"
            type="checkbox"
            checked={filters.inStock === 'true'}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 accent-orange-600"
          />
        </label>
      </div>

      <button type="button" onClick={onApply} className="btn-primary mt-6 flex w-full justify-center rounded-2xl">
        Apply filters
      </button>
    </aside>
  );
}

export default ProductFilter;
