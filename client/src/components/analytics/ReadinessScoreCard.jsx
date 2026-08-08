import ScoreRing from '../analysis/ScoreRing';

const ReadinessScoreCard = ({ score }) => (
  <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 flex items-center gap-6">
    <ScoreRing label="" score={score} />
    <div>
      <p className="text-sm font-semibold text-[#111827]">Placement Readiness Score</p>
      <p className="text-xs text-[#6B7280] mt-1">
        Based on your latest Resume, HR Interview, and GD performance.
      </p>
    </div>
  </div>
);

export default ReadinessScoreCard;
