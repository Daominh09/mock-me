import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// ── Single-select ─────────────────────────────────────────────────────────────
export default function SearchableDropdown({ placeholder, options, value, onChange, multiple }) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function onOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  // ── multi helpers ──
  function isSelected(o) {
    return multiple ? value.includes(o) : value === o;
  }

  function toggle(o) {
    if (!multiple) {
      onChange(o);
      setOpen(false);
      return;
    }
    onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);
  }

  function clearAll() {
    onChange(multiple ? [] : '');
    setOpen(false);
  }

  // ── trigger label ──
  function triggerLabel() {
    if (!multiple) return value || placeholder;
    if (value.length === 0) return placeholder;
    if (value.length === 1) return value[0];
    if (value.length === 2) return value.join(', ');
    return `${value[0]}, ${value[1]} +${value.length - 2}`;
  }

  const hasValue = multiple ? value.length > 0 : Boolean(value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setSearch(''); }}
        className={`w-full flex items-center justify-between bg-input border border-white/12 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent/40 transition-colors ${hasValue ? 'text-white' : 'text-white/40'}`}
      >
        <span className="truncate">{triggerLabel()}</span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 text-white/25 shrink-0 ml-2 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-input border border-white/12 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-2 border-b border-white/8">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full bg-white/5 rounded-lg px-3 py-1.5 text-white text-xs placeholder:text-white/25 focus:outline-none"
            />
          </div>
          <div className="max-h-44 overflow-y-auto">
            {/* Any / clear */}
            <button
              type="button"
              onClick={clearAll}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-white/5 ${hasValue ? 'text-white/50' : 'text-accent font-medium'}`}
            >
              <span>Any</span>
              {!hasValue && <span className="text-accent text-xs">✓</span>}
            </button>

            {filtered.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => toggle(o)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-white/5 ${isSelected(o) ? 'text-accent font-medium' : 'text-white/70'}`}
              >
                <span>{o}</span>
                {isSelected(o) && <span className="text-accent text-xs">✓</span>}
              </button>
            ))}

            {filtered.length === 0 && (
              <p className="px-4 py-3 text-white/25 text-xs">No results</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

SearchableDropdown.propTypes = {
  placeholder: PropTypes.string.isRequired,
  options:     PropTypes.arrayOf(PropTypes.string).isRequired,
  value:       PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  onChange:    PropTypes.func.isRequired,
  multiple:    PropTypes.bool,
};

SearchableDropdown.defaultProps = {
  multiple: false,
};
