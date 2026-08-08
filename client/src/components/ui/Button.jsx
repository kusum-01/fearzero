const VARIANTS = {
  primary: 'bg-[#EC4899] text-white hover:bg-[#DB2777] active:scale-[0.98]',
  secondary: 'bg-white text-[#111827] border border-[#E5E7EB] hover:bg-[#FAFAFA]',
  ghost: 'bg-transparent text-[#6B7280] hover:bg-[#FAFAFA]',
  destructive: 'bg-transparent text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444]/5',
};

const Button = ({ variant = 'primary', className = '', disabled, children, ...props }) => (
  <button
    disabled={disabled}
    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC4899]/40 focus-visible:ring-offset-1
    ${VARIANTS[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
