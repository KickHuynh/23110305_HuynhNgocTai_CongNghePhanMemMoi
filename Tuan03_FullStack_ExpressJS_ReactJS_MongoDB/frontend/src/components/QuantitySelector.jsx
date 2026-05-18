function QuantitySelector({ value, onChange, min = 1, max = Infinity, disabled = false }) {
  const currentValue = Number(value || min);

  const updateValue = (nextValue) => {
    const safeValue = Math.max(min, Math.min(max, nextValue));
    onChange(safeValue);
  };

  return (
    <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        disabled={disabled || currentValue <= min}
        onClick={() => updateValue(currentValue - 1)}
        className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-slate-700 transition hover:bg-slate-100 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        -
      </button>
      <div className="min-w-14 px-2 text-center text-base font-bold text-slate-950">{currentValue}</div>
      <button
        type="button"
        disabled={disabled || currentValue >= max}
        onClick={() => updateValue(currentValue + 1)}
        className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-slate-700 transition hover:bg-slate-100 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}

export default QuantitySelector;
