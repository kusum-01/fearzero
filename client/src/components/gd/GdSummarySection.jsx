const GdSummarySection = ({ summary }) => {
  const scores = [
    { label: 'Overall', value: summary.overallScore },
    { label: 'Communication', value: summary.communication },
    { label: 'Confidence', value: summary.confidence },
    { label: 'Critical Thinking', value: summary.criticalThinking },
    { label: 'Leadership', value: summary.leadership },
    { label: 'Relevance', value: summary.relevance },
    { label: 'Vocabulary', value: summary.vocabulary },
    { label: 'Fluency', value: summary.fluency },
    { label: 'Participation', value: summary.participation },
  ];

  const lists = [
    { title: 'Strengths', icon: '✅', items: summary.strengths },
    { title: 'Weaknesses', icon: '⚠️', items: summary.weaknesses },
    { title: 'Improvement Suggestions', icon: '💡', items: summary.improvementSuggestions },
  ];

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {scores.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {lists.map((list) => (
          <div key={list.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>{list.icon}</span> {list.title}
            </h3>
            <ul className="space-y-2">
              {(list.items || []).map((item, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-gray-300">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Detailed AI Feedback</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{summary.detailedFeedback}</p>
      </section>
    </div>
  );
};

export default GdSummarySection;
