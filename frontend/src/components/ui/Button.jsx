import PropTypes from 'prop-types';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 cursor-pointer select-none';

  const variants = {
    primary: 'bg-[#A5CDFE] text-[#1C1917] hover:bg-[#c2dcfe] px-5 py-2.5 text-sm',
    outline: 'border border-white/25 text-white hover:bg-white/10 px-5 py-2.5 text-sm',
    light:   'bg-[#F0EDE8] text-black hover:bg-white px-6 py-3 text-sm w-full',
    ghost:   'text-white/60 hover:text-white text-sm px-3 py-1',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children:  PropTypes.node.isRequired,
  variant:   PropTypes.oneOf(['primary', 'outline', 'light', 'ghost']),
  className: PropTypes.string,
};
