// Тонкая обёртка над Telegram WebApp SDK с безопасными фолбэками
// для запуска в обычном браузере (для разработки).

type ImpactStyle = "light" | "medium" | "heavy" | "rigid" | "soft";
type NotificationType = "error" | "success" | "warning";

interface TelegramHapticFeedback {
  impactOccurred: (style: ImpactStyle) => void;
  notificationOccurred: (type: NotificationType) => void;
  selectionChanged: () => void;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  HapticFeedback: TelegramHapticFeedback;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  colorScheme?: "light" | "dark";
  themeParams?: Record<string, string>;
  initDataUnsafe?: {
    user?: { id: number; first_name?: string; username?: string };
  };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export function getTelegram(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export function initTelegram() {
  const tg = getTelegram();
  if (!tg) return;
  try {
    tg.ready();
    tg.expand();
    tg.setHeaderColor?.("#0a0a0a");
    tg.setBackgroundColor?.("#0a0a0a");
  } catch {
    /* no-op */
  }
}

export function hapticTap() {
  getTelegram()?.HapticFeedback.impactOccurred("light");
}

export function hapticError() {
  getTelegram()?.HapticFeedback.notificationOccurred("error");
}

export function hapticSuccess() {
  getTelegram()?.HapticFeedback.notificationOccurred("success");
}

export function hapticHeavy() {
  getTelegram()?.HapticFeedback.impactOccurred("heavy");
}
