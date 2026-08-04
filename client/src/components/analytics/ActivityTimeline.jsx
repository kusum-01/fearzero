const TYPE_ICONS = {
  resume_analysis: '📄',
  hr_interview: '💬',
  group_discussion: '👥',
};

const ActivityTimeline = ({ events }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
    <h3 className="text-sm font-semibold text-gray-700 mb-4">Activity Timeline</h3>
    {events.length === 0 ? (
      <p className="text-sm text-gray-400 text-center py-10">No activity yet.</p>
    ) : (
      <ul className="space-y-3">
        {events.map((event, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="text-lg shrink-0">{TYPE_ICONS[event.type] || '•'}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-700 truncate">{event.label}</p>
              <p className="text-xs text-gray-400">
                {new Date(event.date).toLocaleDateString()} {event.score != null && `• Score: ${event.score}`}
              </p>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default ActivityTimeline;
