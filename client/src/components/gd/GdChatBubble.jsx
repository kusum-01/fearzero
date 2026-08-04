const SPEAKER_STYLES = {
  moderator: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', avatar: '🎙️' },
  participant1: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', avatar: '👩' },
  participant2: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', avatar: '👨' },
  participant3: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', avatar: '👩‍🦱' },
  user: { bg: 'bg-blue-600', text: 'text-white', avatar: '🧑' },
};

const GdChatBubble = ({ speaker, speakerName, content }) => {
  const isUser = speaker === 'user';
  const style = SPEAKER_STYLES[speaker] || SPEAKER_STYLES.participant1;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[80%] ${isUser ? 'flex-row-reverse' : ''} flex items-end gap-2`}>
        <span className="text-lg shrink-0">{style.avatar}</span>
        <div>
          {!isUser && (
            <p className={`text-xs font-medium mb-0.5 ${style.text}`}>{speakerName}</p>
          )}
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed border
            ${isUser ? `${style.bg} ${style.text} rounded-tr-sm border-transparent` : `${style.bg} ${style.text} rounded-tl-sm`}`}
          >
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GdChatBubble;
