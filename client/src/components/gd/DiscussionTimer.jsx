import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

const DiscussionTimer = ({ durationSeconds = 300 }) => {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isLow = secondsLeft <= 30;

  return (
    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
      ${isLow ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
      <Clock size={12} />
      {minutes}:{seconds.toString().padStart(2, '0')}
    </span>
  );
};

export default DiscussionTimer;
