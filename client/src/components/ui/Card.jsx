const Card = ({ className = '', interactive = false, children, ...props }) => (
  <div
    className={`bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6
    ${interactive ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''}
    ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
