const Recommendations = ({ recommendations }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
    <h3 className="text-sm font-semibold text-gray-700 mb-4">Learning Recommendations</h3>
    {recommendations.length === 0 ? (
      <p className="text-sm text-gray-400 text-center py-6">You're all caught up!</p>
    ) : (
      <ul className="space-y-2">
        {recommendations.map((rec, idx) => (
          <li key={idx} className="text-sm text-gray-600 flex gap-2">
            <span className="text-blue-400">→</span>
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Recommendations;
