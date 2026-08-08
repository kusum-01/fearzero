const Input = ({ label, error, className = '', id, ...props }) => (
  <div className="mb-4">
    {label && (
      <label htmlFor={id} className="block text-xs font-medium text-[#111827] mb-1.5">
        {label}
      </label>
    )}
    <input
      id={id}
      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#111827] placeholder:text-[#9CA3AF]
      transition-colors duration-150 focus:outline-none focus:ring-2
      ${error
        ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]'
        : 'border-[#E5E7EB] focus:ring-[#EC4899]/20 focus:border-[#EC4899]'}
      ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-[#EF4444] mt-1.5">{error}</p>}
  </div>
);

export default Input;
