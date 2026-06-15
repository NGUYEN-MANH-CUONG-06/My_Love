import { useState, useEffect } from "react";
import "./LoveTimer.css";

const START_DATE = new Date("2022-11-07T00:00:00");

export default function LoveTimer() {
  const [time, setTime] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = now.getTime() - START_DATE.getTime();

      const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
      const months = Math.floor(
        (difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30),
      );
      const days = Math.floor(
        (difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24),
      );
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTime({ years, months, days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="love-timer-container glass" data-aos="fade-up">
      <h3
        style={{
          color: "#ff4f81",
          fontFamily: "'Playfair Display', serif",
          marginBottom: "20px",
        }}
      >
        Tụi mình đã bên nhau... ⏳
      </h3>
      <div className="timer-grid">
        <div className="time-box">
          <span>{time.years}</span>Năm
        </div>
        <div className="time-box">
          <span>{time.months}</span>Tháng
        </div>
        <div className="time-box">
          <span>{time.days}</span>Ngày
        </div>
        <div className="time-box">
          <span>{time.hours}</span>Giờ
        </div>
        <div className="time-box">
          <span>{time.minutes}</span>Phút
        </div>
        <div className="time-box heartbeat-box">
          <span>{time.seconds}</span>Giây
        </div>
      </div>
      <div className="heart-pulse-icon">❤️</div>
    </div>
  );
}
