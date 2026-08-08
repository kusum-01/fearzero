const ChatBubble = ({ role, content }) => {
  const isAI = role === 'ai';

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-3`}>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
        ${isAI
          ? 'bg-[#FFF7FA] border border-[#F3D9E6] text-[#111827] rounded-tl-sm'
          : 'bg-[#EC4899] text-white rounded-tr-sm'}`}
      >
        {content}
      </div>
    </div>
  );
};

export default ChatBubble;
