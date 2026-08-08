import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ScoreHistoryChart = ({ title, data, dataKey, color = '#EC4899' }) => (
  <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
    <h3 className="text-sm font-semibold text-[#111827] mb-4">{title}</h3>
    {data.length === 0 ? (
      <p className="text-sm text-[#9CA3AF] text-center py-10">No data yet.</p>
    ) : (
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6B7280' }} />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{ r: 3, fill: color }} />
        </LineChart>
      </ResponsiveContainer>
    )}
  </div>
);

export default ScoreHistoryChart;
