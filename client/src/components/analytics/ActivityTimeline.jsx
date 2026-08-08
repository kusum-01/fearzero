import { FileText, MessageSquare, Users } from 'lucide-react';

const TYPE_CONFIG = {
  resume_analysis: { icon: FileText, tone: '#EC4899' },
  hr_interview: { icon: MessageSquare, tone: '#3B82F6' },
  group_discussion: { icon: Users, tone: '#F59E0B' },
};

const ActivityTimeline = ({ events }) => (
  <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
    <h3 className="text-sm font-semibold text-[#111827] mb-4">Activity Timeline</h3>
    {events.length === 0 ? (
      <p className="text-sm text-[#9CA3AF] text-center py-10">No activity yet.</p>
    ) : (
      <ul className="space-y-3">
        {events.map((event, idx) => {
          const config = TYPE_CONFIG[event.type] || TYPE_CONFIG.resume_analysis;
          const Icon = config.icon;
          return (
            <li key={idx} className="flex items-start gap-3">
              <span
                className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${config.tone}1A`, color: config.tone }}
              >
                <Icon size={14} strokeWidth={2.5} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[#111827] truncate">{event.label}</p>
                <p className="text-xs text-[#9CA3AF]">
                  {new Date(event.date).toLocaleDateString()} {event.score != null && `• Score: ${event.score}`}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

export default ActivityTimeline;
