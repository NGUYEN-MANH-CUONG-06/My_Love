import { useEffect, useState } from "react";

export default function LiveTimer({ startDate }: { startDate: Date }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTime({ days, hours, minutes, seconds });
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="timer-container" data-aos="zoom-in">
      <div className="timer-box">
        <span className="timer-value">{time.days}</span>
        <span className="timer-label">Ngày</span>
      </div>
      <div className="timer-box">
        <span className="timer-value">{time.hours}</span>
        <span className="timer-label">Giờ</span>
      </div>
      <div className="timer-box">
        <span className="timer-value">{time.minutes}</span>
        <span className="timer-label">Phút</span>
      </div>
      <div className="timer-box">
        <span className="timer-value">{time.seconds}</span>
        <span className="timer-label">Giây</span>
      </div>
    </div>
  );
}
