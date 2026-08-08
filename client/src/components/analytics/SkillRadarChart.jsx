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
    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
      <h3 className="text-sm font-semibold text-[#111827] mb-4">Skill Overview</h3>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#F3F4F6" />
          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#6B7280' }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
          <Radar dataKey="value" stroke="#EC4899" fill="#EC4899" fillOpacity={0.25} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillRadarChart;
