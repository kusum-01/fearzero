const RecentFeedback = ({ feedback }) => (
  <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
    <h3 className="text-sm font-semibold text-[#111827] mb-4">Recent AI Feedback</h3>
    {feedback.length === 0 ? (
      <p className="text-sm text-[#9CA3AF] text-center py-10">No feedback yet.</p>
    ) : (
      <ul className="space-y-4">
        {feedback.map((item, idx) => (
          <li key={idx} className="border-b border-[#F3F4F6] pb-3 last:border-0 last:pb-0">
            <p className="text-xs font-medium text-[#EC4899] mb-1">{item.source}</p>
            <p className="text-sm text-[#374151] leading-relaxed">{item.feedback}</p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default RecentFeedback;
