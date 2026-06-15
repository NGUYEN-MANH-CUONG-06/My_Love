import { useState } from "react";
import "./LoveRoulette.css";

const options = [
  "Ăn Lẩu 🍲",
  "Xem phim 🎬",
  "Em nấu 👨‍🍳",
  "Anh rửa bát 🧼",
  "Ăn Đồ Nướng 🍖",
  "Trà sữa 🧋",
  "Anh mát-xa 💆‍♀️",
  "Ở nhà ôm 🤗",
];

export default function LoveRoulette() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState("");
  const [rotation, setRotation] = useState(0);

  const spinRoulette = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult("");

    const randomOption = Math.floor(Math.random() * options.length);
    // Tính toán góc quay để mũi tên chỉ đúng vào giữa slice được chọn.
    // Mũi tên nằm ở trên cùng (góc 270deg hoặc -90deg so với góc 0deg là bên phải).
    // Do đó, cần tính offset cẩn thận.
    // Đơn giản hơn: cứ quay ngẫu nhiên, kết quả được tính dựa trên góc dừng.

    // Mỗi vòng quay 360 độ, quay ít nhất 5 vòng (1800 độ).
    // Option 0 nằm từ 0-45 độ, giữa là 22.5 độ.
    // Nếu muốn mũi tên chỉ vào Option 0 (đang nằm ở 22.5 độ), mà mũi tên ở trên cùng (-90 độ),
    // Wheel cần quay ngược lại hoặc tính toán chuẩn.
    // Thay vì thế, ta sẽ chọn option -> tính góc đích.

    const sliceAngle = 360 / options.length;
    // Điểm giữa của target option
    const targetCenter = randomOption * sliceAngle + sliceAngle / 2;
    // Để targetCenter nằm dưới mũi tên (đỉnh 270 độ), wheel cần quay thêm (270 - targetCenter)
    const targetRotation = 360 * 5 + (270 - targetCenter);

    setRotation(rotation + targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(options[randomOption]);
    }, 4000);
  };

  return (
    <div className="roulette-container glass" data-aos="zoom-in">
      <h3 style={{ color: "#ff4f81", fontFamily: "'Playfair Display', serif" }}>
        Hôm nay làm gì ta? 🎡
      </h3>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Dành cho những ngày không biết đi đâu về đâu...
      </p>

      <div className="wheel-wrapper">
        <div className="wheel-pointer">▼</div>
        <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
          {options.map((opt, index) => (
            <div
              key={index}
              className="wheel-item"
              style={{ transform: `rotate(${index * 45}deg)` }}
            >
              <div className="item-text-wrapper">
                <span className="item-text">{opt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn btn-primary-pulse"
        onClick={spinRoulette}
        disabled={isSpinning}
        style={{ marginTop: "30px" }}
      >
        {isSpinning ? "Đang quay..." : "Quay ngay! 🎰"}
      </button>

      {result && (
        <div className="roulette-result fade-in">
          <h4>Chốt đơn: {result}</h4>
        </div>
      )}
    </div>
  );
}
