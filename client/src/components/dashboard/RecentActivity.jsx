const RecentActivity = ({ activity = [] }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <h2 className="text-sm font-semibold text-gray-700 mb-4">Recent Activity</h2>

    {activity.length === 0 ? (
      <p className="text-sm text-gray-400 py-6 text-center">
        No activity yet. Start a practice test to see it here.
      </p>
    ) : (
      <ul className="space-y-3">
        {activity.map((item, idx) => (
          <li key={idx} className="text-sm text-gray-600 border-b border-gray-50 pb-2 last:border-0">
            {item.label}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default RecentActivity;
