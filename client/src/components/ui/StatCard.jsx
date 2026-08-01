const StatCard = ({ label, value, icon }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
    <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-xl">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

export default StatCard;
