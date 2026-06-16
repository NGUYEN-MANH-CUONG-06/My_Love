const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const createHttpError = (message, statusCode) =>
  Object.assign(new Error(message), { statusCode });

const MAX_AUDIO_BYTES = 4 * 1024 * 1024;

export const getErrorStatus = (error) =>
  Number.isInteger(error?.statusCode) ? error.statusCode : 500;

export const getTelegramConfig = (env) => {
  const botToken =
    typeof env.TELEGRAM_BOT_TOKEN === "string"
      ? env.TELEGRAM_BOT_TOKEN.trim()
      : "";
  const chatId =
    typeof env.TELEGRAM_CHAT_ID === "string" ? env.TELEGRAM_CHAT_ID.trim() : "";

  if (!botToken || !chatId) {
    return null;
  }

  return { botToken, chatId };
};

export const sendTelegramMessage = async ({
  botToken,
  chatId,
  message,
  now = new Date(),
}) => {
  const text = typeof message === "string" ? message.trim() : "";

  if (!text) {
    throw createHttpError("Message is required", 400);
  }

  if (text.length > 1000) {
    throw createHttpError("Message is too long", 400);
  }

  const sentAt = new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(now);

  const telegramMessage = [
    "💌 <b>Có lời nhắn mới từ em</b>",
    "",
    `<i>${escapeHtml(text)}</i>`,
    "",
    `Gửi lúc: ${escapeHtml(sentAt)}`,
  ].join("\n");

  const telegramResponse = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: "HTML",
      }),
    },
  );

  if (!telegramResponse.ok) {
    const errorBody = await telegramResponse.json().catch(() => null);
    const description =
      typeof errorBody?.description === "string"
        ? errorBody.description
        : "Telegram did not accept it";

    throw createHttpError(description, 502);
  }
};

const parseAudioData = ({ audioData, mimeType }) => {
  if (typeof audioData !== "string" || !audioData.trim()) {
    throw createHttpError("Audio is required", 400);
  }

  // MediaRecorder can include codec parameters before the base64 payload.
  const dataUrlMatch = audioData.match(/^data:([^,]*?);base64,(.+)$/i);
  const detectedMimeType = dataUrlMatch?.[1];
  const base64Audio = dataUrlMatch?.[2] ?? audioData;
  const cleanBase64 = base64Audio.replace(/\s/g, "");

  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(cleanBase64)) {
    throw createHttpError("Audio data is invalid", 400);
  }

  const buffer = Buffer.from(cleanBase64, "base64");

  if (!buffer.length) {
    throw createHttpError("Audio is empty", 400);
  }

  if (buffer.length > MAX_AUDIO_BYTES) {
    throw createHttpError("Audio is too large", 413);
  }

  return {
    buffer,
    mimeType:
      typeof mimeType === "string" && mimeType.trim()
        ? mimeType.trim()
        : detectedMimeType || "audio/webm",
  };
};

const getAudioFileName = (mimeType) => {
  if (mimeType.includes("ogg")) return "love-voice.ogg";
  if (mimeType.includes("mp4")) return "love-voice.m4a";
  if (mimeType.includes("mpeg")) return "love-voice.mp3";
  return "love-voice.webm";
};

const sendTelegramAudioFile = async ({
  botToken,
  chatId,
  method,
  fieldName,
  buffer,
  mimeType,
  durationSeconds,
  caption,
}) => {
  const formData = new FormData();
  const blob = new Blob([buffer], { type: mimeType });

  formData.append("chat_id", chatId);
  formData.append(fieldName, blob, getAudioFileName(mimeType));
  formData.append("caption", caption);
  formData.append("parse_mode", "HTML");

  if (
    (method === "sendVoice" || method === "sendAudio") &&
    Number.isFinite(durationSeconds) &&
    durationSeconds > 0
  ) {
    formData.append("duration", String(Math.round(durationSeconds)));
  }
  // For sendAudio, we can set the performer and title to make it look nicer in Telegram
  const telegramResponse = await fetch(
    `https://api.telegram.org/bot${botToken}/${method}`,
    {
      method: "POST",
      body: formData,
    },
  );
  // Telegram may reject the file if the mime type is not supported for the method, so we will try different methods in order of preference
  if (!telegramResponse.ok) {
    const errorBody = await telegramResponse.json().catch(() => null);
    const description =
      typeof errorBody?.description === "string"
        ? errorBody.description
        : "Telegram did not accept the voice message";

    throw createHttpError(description, 502);
  }
};

export const sendTelegramVoiceMessage = async ({
  botToken,
  chatId,
  audioData,
  mimeType,
  durationSeconds,
  now = new Date(),
}) => {
  const audio = parseAudioData({ audioData, mimeType });
  const sentAt = new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(now);
  const caption = [
    "🎙️ <b>Có giọng nói mới từ em</b>",
    "",
    `Gửi lúc: ${escapeHtml(sentAt)}`,
  ].join("\n");

  try {
    await sendTelegramAudioFile({
      botToken,
      chatId,
      method: "sendVoice",
      fieldName: "voice",
      buffer: audio.buffer,
      mimeType: audio.mimeType,
      durationSeconds,
      caption,
    });
  } catch (voiceError) {
    try {
      await sendTelegramAudioFile({
        botToken,
        chatId,
        method: "sendAudio",
        fieldName: "audio",
        buffer: audio.buffer,
        mimeType: audio.mimeType,
        durationSeconds,
        caption,
      });
    } catch (audioError) {
      try {
        await sendTelegramAudioFile({
          botToken,
          chatId,
          method: "sendDocument",
          fieldName: "document",
          buffer: audio.buffer,
          mimeType: audio.mimeType,
          durationSeconds,
          caption,
        });
      } catch (documentError) {
        throw createHttpError(
          documentError instanceof Error
            ? documentError.message
            : audioError instanceof Error
              ? audioError.message
              : voiceError instanceof Error
                ? voiceError.message
                : "Could not send voice message",
          getErrorStatus(documentError),
        );
      }
    }
  }
};
