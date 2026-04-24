import PropTypes from 'prop-types';

/**
 * Horizontal auto-scrolling ticker (marquee).
 *
 * Props:
 *   items     — array of ReactNodes to display in sequence
 *   speed     — animation duration in seconds (default 40)
 *   className — extra classes on the outer wrapper
 */
export default function Ticker({ items, speed = 40, className = '' }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        {['first', 'second'].flatMap((set) =>
          items.map((item, i) => (
            <span key={`${set}-${i}`} className="flex items-center gap-2 px-6 shrink-0">
              {item}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

Ticker.propTypes = {
  items:     PropTypes.arrayOf(PropTypes.node).isRequired,
  speed:     PropTypes.number,
  className: PropTypes.string,
};
