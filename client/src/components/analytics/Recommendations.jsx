import { ArrowRight } from 'lucide-react';

const Recommendations = ({ recommendations }) => (
  <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
    <h3 className="text-sm font-semibold text-[#111827] mb-4">Learning Recommendations</h3>
    {recommendations.length === 0 ? (
      <p className="text-sm text-[#9CA3AF] text-center py-6">You're all caught up!</p>
    ) : (
      <ul className="space-y-2.5">
        {recommendations.map((rec, idx) => (
          <li key={idx} className="text-sm text-[#374151] flex gap-2 leading-relaxed">
            <ArrowRight size={14} className="text-[#EC4899] shrink-0 mt-0.5" />
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Recommendations;
