import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ScoreHistoryChart = ({ title, data, dataKey, color = '#2563eb' }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
    <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
    {data.length === 0 ? (
      <p className="text-sm text-gray-400 text-center py-10">No data yet.</p>
    ) : (
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    )}
  </div>
);

export default ScoreHistoryChart;
