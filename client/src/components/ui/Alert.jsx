const VARIANTS = {
  error: { bg: 'bg-[#EF4444]/5', border: 'border-[#EF4444]/20', text: 'text-[#EF4444]', icon: '⚠' },
  success: { bg: 'bg-[#22C55E]/5', border: 'border-[#22C55E]/20', text: 'text-[#22C55E]', icon: '✓' },
  info: { bg: 'bg-[#3B82F6]/5', border: 'border-[#3B82F6]/20', text: 'text-[#3B82F6]', icon: 'ℹ' },
  warning: { bg: 'bg-[#F59E0B]/5', border: 'border-[#F59E0B]/20', text: 'text-[#F59E0B]', icon: '!' },
};

const Alert = ({ variant = 'info', children }) => {
  const style = VARIANTS[variant];
  return (
    <div className={`flex items-start gap-2 px-3.5 py-2.5 rounded-lg border text-sm mb-4 ${style.bg} ${style.border} ${style.text}`}>
      <span className="shrink-0 font-medium">{style.icon}</span>
      <span>{children}</span>
    </div>
  );
};

export default Alert;
