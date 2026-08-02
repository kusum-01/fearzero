const ScoreRing = ({ label, score }) => {
  const color = score >= 75 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-500';

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center">
      <div className={`text-3xl font-bold ${color}`}>{score}</div>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
};

export default ScoreRing;
