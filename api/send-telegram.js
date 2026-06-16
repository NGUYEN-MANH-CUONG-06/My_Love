import {
  getErrorStatus,
  getTelegramConfig,
  sendTelegramMessage,
} from "./telegram-utils.js";

const getBody = (body) => {
  if (typeof body === "string") {
    return JSON.parse(body || "{}");
  }

  return body || {};
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const config = getTelegramConfig(process.env);

  if (!config) {
    return res.status(500).json({ message: "Telegram is not configured" });
  }

  try {
    const { message } = getBody(req.body);
    await sendTelegramMessage({ ...config, message });

    return res.status(200).json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not send message";

    return res.status(getErrorStatus(error)).json({ message });
  }
}
