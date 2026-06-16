import { useState } from "react";
import { moodOptions } from "../data";
import "./MoodCheckIn.css";

type MoodStatus = "idle" | "sending" | "sent" | "error";

export default function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState<(typeof moodOptions)[number] | null>(
    null,
  );
  const [status, setStatus] = useState<MoodStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const sendMood = async (mood: (typeof moodOptions)[number]) => {
    setSelectedMood(mood);
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: [
            `💗 Mood check-in của em: ${mood.emoji} ${mood.label}`,
            "",
            mood.telegramText,
          ].join("\n"),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const responseMessage =
          typeof body?.message === "string" ? body.message : "";

        throw new Error(responseMessage || "Mood check-in failed");
      }

      setStatus("sent");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Chưa gửi được mood rồi, em thử lại nha.",
      );
      setStatus("error");
    }
  };

  return (
    <div className="mood-check-in glass" data-aos="fade-up">
      <div className="mood-heading">
        <span>Hôm nay em thế nào?</span>
        <p>Chọn một mood để anh biết đường thương em hơn.</p>
      </div>

      <div className="mood-options">
        {moodOptions.map((mood) => (
          <button
            key={mood.label}
            className={`mood-option ${
              selectedMood?.label === mood.label ? "selected" : ""
            }`}
            onClick={() => sendMood(mood)}
            disabled={status === "sending"}
          >
            <span>{mood.emoji}</span>
            {mood.label}
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="mood-reply">
          <p>{selectedMood.reply}</p>
          {status === "sending" && <small>Đang gửi mood tới anh...</small>}
          {status === "sent" && <small>Anh nhận được mood của em rồi đó.</small>}
          {status === "error" && (
            <small className="mood-error">
              {errorMessage || "Chưa gửi được mood rồi, em thử lại nha."}
            </small>
          )}
        </div>
      )}
    </div>
  );
}
