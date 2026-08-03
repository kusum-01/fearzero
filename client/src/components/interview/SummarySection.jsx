const SummarySection = ({ summary }) => {
  const scores = [
    { label: 'Overall Score', value: summary.overallScore },
    { label: 'Communication', value: summary.communicationScore },
    { label: 'Confidence', value: summary.confidenceScore },
    { label: 'Clarity', value: summary.clarityScore },
    { label: 'Professionalism', value: summary.professionalismScore },
  ];

  const lists = [
    { title: 'Strengths', icon: '✅', items: summary.strengths },
    { title: 'Areas for Improvement', icon: '⚠️', items: summary.areasForImprovement },
    { title: 'Suggested Better Answers', icon: '💡', items: summary.suggestedBetterAnswers },
  ];

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Final AI Feedback</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{summary.finalFeedback}</p>
      </section>
    </div>
  );
};

export default SummarySection;
