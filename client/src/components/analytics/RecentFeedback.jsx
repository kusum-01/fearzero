const RecentFeedback = ({ feedback }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
    <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent AI Feedback</h3>
    {feedback.length === 0 ? (
      <p className="text-sm text-gray-400 text-center py-10">No feedback yet.</p>
    ) : (
      <ul className="space-y-4">
        {feedback.map((item, idx) => (
          <li key={idx} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
            <p className="text-xs font-medium text-blue-600 mb-1">{item.source}</p>
            <p className="text-sm text-gray-600">{item.feedback}</p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default RecentFeedback;
