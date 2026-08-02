const FeedbackList = ({ title, items = [], icon }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
      <span>{icon}</span> {title}
    </h3>
    {items.length === 0 ? (
      <p className="text-sm text-gray-400">Nothing to show.</p>
    ) : (
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm text-gray-600 flex gap-2">
            <span className="text-gray-300">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default FeedbackList;
