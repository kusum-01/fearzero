import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeeklyProgressChart = ({ weeklyData }) => {
  const weekKeys = new Set();
  weeklyData.resumeWeekly.forEach((w) => weekKeys.add(w._id));
  weeklyData.interviewWeekly.forEach((w) => weekKeys.add(w._id));
  weeklyData.gdWeekly.forEach((w) => weekKeys.add(w._id));

  const merged = Array.from(weekKeys)
    .sort((a, b) => a - b)
    .map((week) => ({
      week: `W${week}`,
      resume: weeklyData.resumeWeekly.find((w) => w._id === week)?.count || 0,
      interview: weeklyData.interviewWeekly.find((w) => w._id === week)?.count || 0,
      gd: weeklyData.gdWeekly.find((w) => w._id === week)?.count || 0,
    }));

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
      <h3 className="text-sm font-semibold text-[#111827] mb-4">Weekly Activity</h3>
      {merged.length === 0 ? (
        <p className="text-sm text-[#9CA3AF] text-center py-10">No activity yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={merged}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#6B7280' }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="resume" fill="#EC4899" name="Resume Analyses" radius={[4, 4, 0, 0]} />
            <Bar dataKey="interview" fill="#3B82F6" name="HR Interviews" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gd" fill="#F59E0B" name="Group Discussions" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WeeklyProgressChart;
