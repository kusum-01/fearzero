const ReadinessScoreCard = ({ score }) => {
  const color = score >= 75 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-500';

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-6">
      <div className={`text-5xl font-bold ${color}`}>{score}</div>
      <div>
        <p className="text-sm font-semibold text-gray-700">Placement Readiness Score</p>
        <p className="text-xs text-gray-500 mt-1">
          Based on your latest Resume, HR Interview, and GD performance.
        </p>
      </div>
    </div>
  );
};

export default ReadinessScoreCard;
