import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const SkillRadarChart = ({ data }) => {
  const chartData = [
    { skill: 'Communication', value: data.communication },
    { skill: 'Confidence', value: data.confidence },
    { skill: 'Clarity', value: data.clarity },
    { skill: 'Critical Thinking', value: data.criticalThinking },
    { skill: 'Leadership', value: data.leadership },
    { skill: 'Professionalism', value: data.professionalism },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Skill Overview</h3>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#f1f5f9" />
          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Radar dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillRadarChart;
