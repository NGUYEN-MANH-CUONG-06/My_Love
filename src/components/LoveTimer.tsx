import { useState, useEffect } from "react";
import "./LoveTimer.css";

const START_DATE = new Date(2022, 10, 7, 0, 0, 0);

const getElapsedTime = (startDate: Date, endDate: Date) => {
  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();
  let hours = endDate.getHours() - startDate.getHours();
  let minutes = endDate.getMinutes() - startDate.getMinutes();
  let seconds = endDate.getSeconds() - startDate.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }

  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }

  if (hours < 0) {
    hours += 24;
    days -= 1;
  }

  if (days < 0) {
    const daysInPreviousMonth = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      0,
    ).getDate();

    days += daysInPreviousMonth;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days, hours, minutes, seconds };
};

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
    const updateTimer = () => {
      const now = new Date();
      setTime(getElapsedTime(START_DATE, now));
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

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
