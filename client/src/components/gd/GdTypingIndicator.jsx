const GdTypingIndicator = () => (
  <div className="flex justify-start mb-3">
    <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 ml-9">
      <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce" />
    </div>
  </div>
);

export default GdTypingIndicator;
