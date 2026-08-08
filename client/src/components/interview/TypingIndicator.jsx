const TypingIndicator = () => (
  <div className="flex justify-start mb-3">
    <div className="bg-[#FFF7FA] border border-[#F3D9E6] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
      <span className="w-1.5 h-1.5 bg-[#EC4899] rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 bg-[#EC4899] rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 bg-[#EC4899] rounded-full animate-bounce" />
    </div>
  </div>
);

export default TypingIndicator;
