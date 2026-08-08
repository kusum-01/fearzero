const ScoreRing = ({ label, score }) => {
  const color = score >= 75 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#EF4444';
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6 flex flex-col items-center transition-shadow duration-200 hover:shadow-md">
      <svg width="88" height="88" className="mb-3">
        <g transform="rotate(-90 44 44)">
          <circle cx="44" cy="44" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="8" />
          <circle
            cx="44" cy="44" r={radius} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
          />
        </g>
        <text
          x="44" y="44" textAnchor="middle" dominantBaseline="central"
          fontSize="20" fontWeight="700" fill="#111827"
        >
          {score}
        </text>
      </svg>
      <p className="text-xs text-[#6B7280] text-center">{label}</p>
    </div>
  );
};

export default ScoreRing;
