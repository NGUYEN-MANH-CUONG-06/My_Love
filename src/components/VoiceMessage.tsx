import { useState } from "react";
import "./VoiceMessage.css";

export default function VoiceMessage() {
  const [isPlaying, setIsPlaying] = useState(false);

  const playVoice = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    // Fallback: Web Speech API for generated voice message if real mp3 not found
    try {
      const audio = new Audio("/assets/voice.mp3");
      audio.play().catch(() => {
        // If file not found, use Speech Synthesis
        const msg = new SpeechSynthesisUtterance("Cảm ơn em đã luôn ở bên anh. Anh yêu em rất nhiều.");
        msg.lang = "vi-VN";
        msg.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(msg);
      });
      audio.onended = () => setIsPlaying(false);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div className="voice-message-container glass" data-aos="zoom-in">
      <h3 style={{ color: "#ff4f81", fontFamily: "'Playfair Display', serif", marginBottom: "15px" }}>
        Gửi em người anh yêu... 🎙️
      </h3>
      <button 
        className={`voice-btn ${isPlaying ? "playing" : ""}`} 
        onClick={playVoice}
      >
        <div className="voice-icon">{isPlaying ? "🔊" : "▶️"}</div>
        <div className="voice-waves">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </button>
      <p style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
        (Nhấn vào để nghe tin nhắn thoại)
      </p>
    </div>
  );
}
