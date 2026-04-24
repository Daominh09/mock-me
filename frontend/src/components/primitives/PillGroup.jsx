import PropTypes from 'prop-types';

const pillClass = (active) =>
  `px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
    active
      ? 'border-accent/60 text-accent bg-accent/10'
      : 'border-white/15 text-white/45 hover:border-white/30 hover:text-white/70'
  }`;

/**
 * Single-select pill group.
 * Pass nullable=true to prepend an "All" pill that calls onChange(null).
 *
 * Props:
 *   options  — string[]
 *   value    — selected string, or null when "All" is active
 *   onChange — (value: string | null) => void
 *   nullable — prepend an "All" pill (default false)
 */
export function PillGroup({ options, value, onChange, nullable = false }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {nullable && (
        <button onClick={() => onChange(null)} className={pillClass(value === null)}>
          All
        </button>
      )}
      {options.map((opt) => (
        <button key={opt} onClick={() => onChange(opt)} className={pillClass(value === opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
}

PillGroup.propTypes = {
  options:  PropTypes.arrayOf(PropTypes.string).isRequired,
  value:    PropTypes.string,
  onChange: PropTypes.func.isRequired,
  nullable: PropTypes.bool,
};

/**
 * Multi-select pill group — toggles items in/out of an array.
 *
 * Props:
 *   options  — string[]
 *   value    — string[] of currently selected options
 *   onChange — (value: string[]) => void
 */
export function MultiPillGroup({ options, value = [], onChange }) {
  function toggle(opt) {
    onChange(value.includes(opt) ? value.filter((x) => x !== opt) : [...value, opt]);
  }
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button key={opt} onClick={() => toggle(opt)} className={pillClass(value.includes(opt))}>
          {opt}
        </button>
      ))}
    </div>
  );
}

MultiPillGroup.propTypes = {
  options:  PropTypes.arrayOf(PropTypes.string).isRequired,
  value:    PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};
