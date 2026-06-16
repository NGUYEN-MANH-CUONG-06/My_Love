import { useEffect, useRef, useState } from "react";
import "./VoiceMessage.css";
import voiceMessage from "../assets/AYE.m4a";

export default function VoiceMessage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = new Audio(voiceMessage);
    audio.preload = "metadata";
    audioRef.current = audio;

    const updateProgress = () => {
      if (!audio.duration) {
        setProgress(0);
        return;
      }

      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setHasPlayed(true);
      setProgress(100);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const playFallbackVoice = () => {
    const msg = new SpeechSynthesisUtterance(
      "Cảm ơn em đã luôn ở bên anh. Anh yêu em rất nhiều.",
    );
    msg.lang = "vi-VN";
    msg.onend = () => {
      setIsPlaying(false);
      setHasPlayed(true);
      setProgress(100);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  };

  const playAudio = async (audio: HTMLAudioElement) => {
    try {
      await audio.play();
      setIsPlaying(true);
      setHasPlayed(true);
    } catch {
      playFallbackVoice();
    }
  };

  const toggleVoice = () => {
    const audio = audioRef.current;

    if (!audio) {
      playFallbackVoice();
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    void playAudio(audio);
  };

  const replayVoice = () => {
    const audio = audioRef.current;

    if (!audio) {
      playFallbackVoice();
      return;
    }

    audio.currentTime = 0;
    setProgress(0);
    void playAudio(audio);
  };

  return (
    <div className="voice-message-container glass" data-aos="zoom-in">
      <h3>Gửi em người anh yêu... 🎙️</h3>
      <div className="voice-controls">
        <button
          className={`voice-btn ${isPlaying ? "playing" : ""}`}
          onClick={toggleVoice}
          aria-label={isPlaying ? "Tạm dừng tin nhắn thoại" : "Nghe tin nhắn thoại"}
        >
          <div className="voice-icon">{isPlaying ? "❚❚" : "▶"}</div>
          <div className="voice-waves">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        {hasPlayed && (
          <button
            className="voice-replay-btn"
            onClick={replayVoice}
            aria-label="Nghe lại từ đầu"
          >
            ↻
          </button>
        )}
      </div>
      <div className="voice-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }}></span>
      </div>
      <p>
        {isPlaying
          ? "Đang phát tin nhắn của anh..."
          : hasPlayed
            ? "Nhấn nút tròn để nghe lại từ đầu"
            : "Nhấn vào để nghe tin nhắn thoại"}
      </p>
    </div>
  );
}
