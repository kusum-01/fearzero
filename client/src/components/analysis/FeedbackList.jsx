const FeedbackList = ({ title, items = [], icon: Icon, tone = '#EC4899' }) => (
  <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
    <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
      <span
        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${tone}1A`, color: tone }}
      >
        <Icon size={14} strokeWidth={2.5} />
      </span>
      {title}
    </h3>
    {items.length === 0 ? (
      <p className="text-sm text-[#6B7280]">Nothing to show.</p>
    ) : (
      <ul className="space-y-2.5">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm text-[#374151] flex gap-2 leading-relaxed">
            <span className="text-[#D1D5DB] mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default FeedbackList;
