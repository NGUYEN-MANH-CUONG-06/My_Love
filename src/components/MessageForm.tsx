import { useEffect, useRef, useState } from "react";
import "./MessageForm.css";

export default function MessageForm() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isLetterFlying, setIsLetterFlying] = useState(false);
  const flightTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (flightTimer.current !== null) {
        window.clearTimeout(flightTimer.current);
      }
    },
    [],
  );

  const launchLetter = () => {
    if (flightTimer.current !== null) {
      window.clearTimeout(flightTimer.current);
    }

    setIsLetterFlying(false);
    window.requestAnimationFrame(() => {
      setIsLetterFlying(true);
      flightTimer.current = window.setTimeout(() => {
        setIsLetterFlying(false);
      }, 1200);
    });
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      setStatus("sending");
      setErrorMessage("");
      launchLetter();

      const response = await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const responseMessage =
          typeof body?.message === "string" ? body.message : "";

        throw new Error(responseMessage || "Telegram request failed");
      }

      setMessage("");
      setStatus("sent");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Chưa gửi được rồi, em thử lại giúp anh nha.",
      );
      setStatus("error");
    }
  };

  return (
    <div className="message-form glass" data-aos="zoom-in">
      <h3>Gửi lời nhắn cho anh 💌</h3>
      <textarea
        placeholder="Em có muốn nói gì với anh không? Cứ gõ vào đây nhé..."
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          setStatus("idle");
          setErrorMessage("");
        }}
      />
      <div className="message-send-zone">
        {isLetterFlying && <span className="letter-flight">💌</span>}
        <button
          className="btn"
          onClick={handleSend}
          disabled={!message.trim() || status === "sending"}
        >
          {status === "sending" ? "Đang gửi..." : "Gửi cho anh ngay ❤️"}
        </button>
      </div>
      {status === "sent" && (
        <p className="message-status success">Tin nhắn đã bay tới anh rồi 💌</p>
      )}
      {status === "error" && (
        <p className="message-status error">
          {errorMessage || "Chưa gửi được rồi, em thử lại giúp anh nha."}
        </p>
      )}
    </div>
  );
}
