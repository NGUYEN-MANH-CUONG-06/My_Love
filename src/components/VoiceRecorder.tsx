import { useEffect, useRef, useState } from "react";
import "./VoiceRecorder.css";

type RecorderStatus =
  | "idle"
  | "recording"
  | "processing"
  | "ready"
  | "sending"
  | "sent"
  | "error";

const MAX_RECORDING_MS = 20_000;

const getPreferredMimeType = () => {
  const mimeTypes = [
    "audio/ogg;codecs=opus",
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
  ];

  if (!("MediaRecorder" in window)) {
    return "";
  }

  return mimeTypes.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ?? "";
};

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not read recording"));
    };
    reader.onerror = () => reject(new Error("Could not read recording"));
    reader.readAsDataURL(blob);
  });

export default function VoiceRecorder() {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startedAtRef = useRef(0);
  const autoStopTimer = useRef<number | null>(null);
  const durationTimer = useRef<number | null>(null);

  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(
    () => () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      if (autoStopTimer.current !== null) {
        window.clearTimeout(autoStopTimer.current);
      }

      if (durationTimer.current !== null) {
        window.clearInterval(durationTimer.current);
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
      recorderRef.current = null;
    },
    [audioUrl],
  );

  const clearTimers = () => {
    if (autoStopTimer.current !== null) {
      window.clearTimeout(autoStopTimer.current);
      autoStopTimer.current = null;
    }

    if (durationTimer.current !== null) {
      window.clearInterval(durationTimer.current);
      durationTimer.current = null;
    }
  };

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioBlob(null);
    setAudioUrl(null);
    setDurationSeconds(0);
  };

  const stopRecording = () => {
    const recorder = recorderRef.current;

    if (!recorder || recorder.state !== "recording") {
      return;
    }

    setStatus("processing");
    clearTimers();
    recorder.stop();
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || !("MediaRecorder" in window)) {
      setStatus("error");
      setErrorMessage("Trình duyệt này chưa hỗ trợ thu âm trực tiếp.");
      return;
    }

    try {
      resetRecording();
      setErrorMessage("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getPreferredMimeType();
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );

      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        clearTimers();
        stopStream();
        const duration = Math.max(
          1,
          Math.ceil((Date.now() - startedAtRef.current) / 1000),
        );
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        setDurationSeconds(duration);
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setStatus("ready");
      };

      startedAtRef.current = Date.now();
      setDurationSeconds(0);
      setStatus("recording");
      recorder.start();

      durationTimer.current = window.setInterval(() => {
        setDurationSeconds(
          Math.min(
            20,
            Math.ceil((Date.now() - startedAtRef.current) / 1000),
          ),
        );
      }, 500);

      autoStopTimer.current = window.setTimeout(stopRecording, MAX_RECORDING_MS);
    } catch (error) {
      clearTimers();
      stopStream();
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Chưa thu âm được rồi, em thử lại nha.",
      );
    }
  };

  const sendRecording = async () => {
    if (!audioBlob) return;

    try {
      setStatus("sending");
      setErrorMessage("");
      const audioData = await blobToDataUrl(audioBlob);
      const response = await fetch("/api/send-telegram-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioData,
          mimeType: audioBlob.type,
          durationSeconds,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const responseMessage =
          typeof body?.message === "string" ? body.message : "";

        throw new Error(responseMessage || "Voice message failed");
      }

      setStatus("sent");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Chưa gửi được giọng nói rồi, em thử lại nha.",
      );
    }
  };

  return (
    <div className="voice-recorder glass" data-aos="zoom-in">
      <h3>Gửi giọng thật cho anh</h3>
      <p className="voice-recorder-subtitle">
        Thu tối đa 20 giây, rồi gửi thẳng tới Telegram của anh.
      </p>

      <div className={`record-orb ${status === "recording" ? "recording" : ""}`}>
        <span>{status === "recording" ? durationSeconds || 1 : "🎙️"}</span>
      </div>

      <div className="voice-recorder-actions">
        {status !== "recording" && (
          <button
            className="btn"
            onClick={startRecording}
            disabled={status === "sending" || status === "processing"}
          >
            {audioBlob ? "Thu lại" : "Bắt đầu thu"}
          </button>
        )}
        {status === "recording" && (
          <button className="btn" onClick={stopRecording}>
            Dừng thu
          </button>
        )}
        {audioBlob && status !== "recording" && (
          <button
            className="btn"
            onClick={sendRecording}
            disabled={status === "sending" || status === "processing"}
          >
            {status === "sending" ? "Đang gửi..." : "Gửi giọng nói"}
          </button>
        )}
      </div>

      {audioUrl && <audio className="voice-preview" src={audioUrl} controls />}

      {status === "processing" && (
        <p className="voice-recorder-status">Đang gói tin nhắn thoại...</p>
      )}
      {status === "sent" && (
        <p className="voice-recorder-status success">
          Giọng nói đã bay tới anh rồi.
        </p>
      )}
      {status === "error" && (
        <p className="voice-recorder-status error">
          {errorMessage || "Có lỗi khi thu hoặc gửi giọng nói."}
        </p>
      )}
    </div>
  );
}
