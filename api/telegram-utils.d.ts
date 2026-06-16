export type TelegramConfig = {
  botToken: string;
  chatId: string;
};

export type TelegramEnv = Record<string, string | undefined>;

export function getErrorStatus(error: unknown): number;

export function getTelegramConfig(env: TelegramEnv): TelegramConfig | null;

export function sendTelegramMessage(
  options: TelegramConfig & {
    message: unknown;
    now?: Date;
  },
): Promise<void>;

export function sendTelegramVoiceMessage(
  options: TelegramConfig & {
    audioData: unknown;
    mimeType?: unknown;
    durationSeconds?: unknown;
    now?: Date;
  },
): Promise<void>;
