import { useState } from "react";
import "./DailyChallenge.css";

const challenges = [
  "Hôm nay hãy ôm anh từ phía sau nhé! 🤗",
  "Hôm nay anh sẽ mua cho em 1 ly trà sữa full topping! 🧋",
  "Em có quyền sai vặt anh 3 lần trong hôm nay! 👑",
  "Gửi cho anh một tấm ảnh selfie xinh nhất của em ngay bây giờ! 📸",
  "Hôm nay hãy nắm tay anh đi dạo 15 phút nhé! 👫",
  "Anh nợ em một nụ hôn bù đắp, hãy đòi ngay! 💋",
  "Hôm nay hai đứa mình cùng nấu một món ăn nha! 🍳",
  "Cùng xem lại một bộ phim cũ mà cả hai từng thích! 🍿",
  "Hãy nói 'Em yêu anh' vào lúc bất ngờ nhất hôm nay! ❤️",
  "Được chọn một món quà nhỏ nhắn bất kỳ trị giá dưới 100k! 🎁",
];

export default function DailyChallenge() {
  const [challenge] = useState(() => {
    const today = new Date().getDate();
    const index = today % challenges.length;
    return challenges[index];
  });
  const [scratched, setScratched] = useState(false);

  return (
    <div className="daily-challenge glass" data-aos="flip-up">
      <h3 style={{ color: "#ff4f81", fontFamily: "'Playfair Display', serif" }}>Thử Thách Tình Yêu Hôm Nay 🎲</h3>
      <p style={{ marginBottom: "20px", color: "#666" }}>Mỗi ngày một điều bất ngờ dành cho em...</p>
      
      {!scratched ? (
        <button className="scratch-btn btn-primary-pulse" onClick={() => setScratched(true)}>
          Cào để xem ngay! ✨
        </button>
      ) : (
        <div className="challenge-result fade-in">
          <h4>{challenge}</h4>
        </div>
      )}
    </div>
  );
}
