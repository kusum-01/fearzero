import ScoreRing from '../analysis/ScoreRing';

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
    { title: 'Strengths', items: summary.strengths },
    { title: 'Weaknesses', items: summary.weaknesses },
    { title: 'Improvement Suggestions', items: summary.improvementSuggestions },
  ];

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {scores.map((s) => (
          <ScoreRing key={s.label} label={s.label} score={s.value} />
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {lists.map((list) => (
          <div key={list.title} className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">{list.title}</h3>
            <ul className="space-y-2.5">
              {(list.items || []).map((item, idx) => (
                <li key={idx} className="text-sm text-[#374151] flex gap-2 leading-relaxed">
                  <span className="text-[#D1D5DB] mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
        <h3 className="text-sm font-semibold text-[#111827] mb-2">Detailed AI Feedback</h3>
        <p className="text-sm text-[#374151] leading-relaxed">{summary.detailedFeedback}</p>
      </section>
    </div>
  );
};

export default GdSummarySection;
