const SPEAKER_STYLES = {
  moderator: { bg: 'bg-[#FFF7FA]', border: 'border-[#F3D9E6]', text: 'text-[#111827]', avatarBg: '#EC4899', initials: 'MD' },
  participant1: { bg: 'bg-[#EFF6FF]', border: 'border-[#DBEAFE]', text: 'text-[#111827]', avatarBg: '#3B82F6', initials: 'A' },
  participant2: { bg: 'bg-[#FFFBEB]', border: 'border-[#FEF3C7]', text: 'text-[#111827]', avatarBg: '#F59E0B', initials: 'R' },
  participant3: { bg: 'bg-[#F0FDF4]', border: 'border-[#DCFCE7]', text: 'text-[#111827]', avatarBg: '#22C55E', initials: 'M' },
  user: { bg: 'bg-[#EC4899]', border: 'border-transparent', text: 'text-white', avatarBg: '#111827', initials: 'You' },
};

const GdChatBubble = ({ speaker, speakerName, content }) => {
  const isUser = speaker === 'user';
  const style = SPEAKER_STYLES[speaker] || SPEAKER_STYLES.participant1;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[80%] ${isUser ? 'flex-row-reverse' : ''} flex items-end gap-2`}>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0"
          style={{ backgroundColor: style.avatarBg }}
        >
          {style.initials}
        </div>
        <div>
          {!isUser && (
            <p className="text-xs font-medium mb-1 text-[#6B7280]">{speakerName}</p>
          )}
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed border
            ${isUser ? `${style.bg} ${style.text} rounded-tr-sm ${style.border}` : `${style.bg} ${style.text} rounded-tl-sm ${style.border}`}`}
          >
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GdChatBubble;
