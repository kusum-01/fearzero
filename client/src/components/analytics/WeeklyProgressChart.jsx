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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Weekly Activity</h3>
      {merged.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">No activity yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={merged}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="resume" fill="#2563eb" name="Resume Analyses" />
            <Bar dataKey="interview" fill="#16a34a" name="HR Interviews" />
            <Bar dataKey="gd" fill="#f59e0b" name="Group Discussions" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WeeklyProgressChart;
