import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Generic prev/next carousel.
 *
 * Props:
 *   items      — array of data objects to carousel through
 *   renderItem — (item, index) => ReactNode — renders the visible slide
 *   className  — extra classes on the root wrapper
 */
export default function Carousel({ items, renderItem, className = '' }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((idx - 1 + items.length) % items.length);
  const next = () => setIdx((idx + 1) % items.length);

  return (
    <div className={`relative ${className}`}>
      {renderItem(items[idx], idx)}

      <div className="flex gap-2 justify-end mt-4">
        {[
          { key: 'prev', fn: prev, path: 'M15 19l-7-7 7-7' },
          { key: 'next', fn: next, path: 'M9 5l7 7-7 7' },
        ].map(({ key, fn, path }) => (
          <button
            key={key}
            onClick={fn}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d={path} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

Carousel.propTypes = {
  items:      PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  className:  PropTypes.string,
};
