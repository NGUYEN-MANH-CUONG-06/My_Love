import { useState } from "react";
import "./MessageForm.css";

export default function MessageForm() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    const email = "cuongnmse181598@fpt.edu.vn";
    const subject = "Gửi anh ngàn lời yêu thương ❤️";
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="message-form glass" data-aos="zoom-in">
      <h3>Gửi lời nhắn cho anh 💌</h3>
      <textarea
        placeholder="Em có muốn nói gì với anh không? Cứ gõ vào đây nhé..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="btn" onClick={handleSend}>
        Gửi cho anh ngay ❤️
      </button>
    </div>
  );
}
