const actions = [
  { label: 'Start Practice Test', icon: '📝' },
  { label: 'Review Weak Topics', icon: '🎯' },
  { label: 'View Progress', icon: '📊' },
];

const QuickActions = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <h2 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {actions.map((action) => (
        <button
          key={action.label}
          className="flex flex-col items-center justify-center gap-2 border border-gray-100 rounded-lg py-4 hover:bg-gray-50 transition-colors"
        >
          <span className="text-xl">{action.icon}</span>
          <span className="text-xs font-medium text-gray-600 text-center">{action.label}</span>
        </button>
      ))}
    </div>
  </div>
);

export default QuickActions;
