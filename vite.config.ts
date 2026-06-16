import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import {
  getErrorStatus,
  getTelegramConfig,
  sendTelegramMessage,
  sendTelegramVoiceMessage,
} from "./api/telegram-utils.js";

const createRequestError = (message: string, statusCode: number) =>
  Object.assign(new Error(message), { statusCode });

const readJsonBody = (req: IncomingMessage, maxBytes = 2000) =>
  new Promise<Record<string, unknown>>((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > maxBytes) {
        reject(createRequestError("Request body is too large", 413));
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(createRequestError("Invalid JSON", 400));
      }
    });
    req.on("error", reject);
  });

const sendJson = (
  res: ServerResponse,
  statusCode: number,
  body: Record<string, unknown>,
) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

const telegramDevApi = (): Plugin => ({
  name: "telegram-dev-api",
  configureServer(server) {
    const getConfig = () =>
      getTelegramConfig({
        ...process.env,
        ...loadEnv(server.config.mode, process.cwd(), ""),
      });

    server.middlewares.use("/api/send-telegram-voice", async (req, res) => {
      if (req.method !== "POST") {
        sendJson(res, 405, { message: "Method not allowed" });
        return;
      }

      const config = getConfig();

      if (!config) {
        sendJson(res, 500, { message: "Telegram is not configured" });
        return;
      }

      try {
        const body = await readJsonBody(req, 6 * 1024 * 1024);
        await sendTelegramVoiceMessage({
          ...config,
          audioData: body.audioData,
          mimeType: body.mimeType,
          durationSeconds: body.durationSeconds,
        });

        sendJson(res, 200, { ok: true });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not send voice message";
        sendJson(res, getErrorStatus(error), { message });
      }
    });

    server.middlewares.use("/api/send-telegram", async (req, res) => {
      if (req.method !== "POST") {
        sendJson(res, 405, { message: "Method not allowed" });
        return;
      }

      const config = getConfig();

      if (!config) {
        sendJson(res, 500, { message: "Telegram is not configured" });
        return;
      }

      try {
        const body = await readJsonBody(req);
        await sendTelegramMessage({ ...config, message: body.message });

        sendJson(res, 200, { ok: true });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not send message";
        sendJson(res, getErrorStatus(error), { message });
      }
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), telegramDevApi()],
});
