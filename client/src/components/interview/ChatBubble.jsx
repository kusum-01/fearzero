const ChatBubble = ({ role, content }) => {
  const isAI = role === 'ai';

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-3`}>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
        ${isAI
          ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
          : 'bg-blue-600 text-white rounded-tr-sm'}`}
      >
        {content}
      </div>
    </div>
  );
};

export default ChatBubble;
