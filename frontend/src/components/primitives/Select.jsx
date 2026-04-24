import PropTypes from 'prop-types';

/**
 * Simple styled native <select> for short, static option lists.
 * Use SearchableDropdown when you need search or multi-select.
 *
 * Props:
 *   options     — string[] or { value, label }[]
 *   value       — currently selected value (string)
 *   onChange    — (value: string) => void
 *   placeholder — shown as the first disabled option (default 'Select…')
 *   className   — extra classes on the <select>
 */
export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  className = '',
}) {
  const normalised = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o
  );

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-input border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:border-accent/40 transition-colors appearance-none cursor-pointer ${className}`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {normalised.map(({ value: v, label }) => (
        <option key={v} value={v}>
          {label}
        </option>
      ))}
    </select>
  );
}

Select.propTypes = {
  options:     PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ value: PropTypes.string, label: PropTypes.string }),
    ])
  ).isRequired,
  value:       PropTypes.string,
  onChange:    PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className:   PropTypes.string,
};
