import { useEffect, useState } from 'react';

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
    <span className={`text-xs font-mono px-2 py-1 rounded-md ${isLow ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
      {minutes}:{seconds.toString().padStart(2, '0')}
    </span>
  );
};

export default DiscussionTimer;
