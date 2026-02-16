// Telegram Mini App Service
// This service handles all Telegram-related functionality

interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    auth_date?: number;
    hash?: string;
    start_param?: string;
  };
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  isClosingConfirmationEnabled: boolean;
  headerColor: string;
  backgroundColor: string;
  bottomBarColor: string;
  isVerticalSwipesEnabled: boolean;
  safeAreaInset: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
  contentSafeAreaInset: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setBottomBarColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  onEvent: (event: string, callback: () => void) => void;
  offEvent: (event: string, callback: () => void) => void;
  sendData: (data: unknown) => void;
  close: () => void;
  requestWriteAccess: () => void;
  ready: () => void;
  expand: () => void;
  requestFullscreen: () => void;
  exitFullscreen: () => void;
  hapticFeedback: {
    impactOccurred: (
      style: "light" | "medium" | "heavy" | "rigid" | "soft",
    ) => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
  CloudStorage: {
    getItem: (
      key: string,
      callback: (error: unknown, value: string | null) => void,
    ) => void;
    setItem: (
      key: string,
      value: string,
      callback: (error: unknown) => void,
    ) => void;
    getItems: (
      keys: string[],
      callback: (error: unknown, values: Record<string, string>) => void,
    ) => void;
    setItems: (
      items: Record<string, string>,
      callback: (error: unknown) => void,
    ) => void;
    removeItem: (key: string, callback: (error: unknown) => void) => void;
    removeItems: (keys: string[], callback: (error: unknown) => void) => void;
    keys: (callback: (error: unknown, keys: string[]) => void) => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

// Initialize Telegram WebApp
export const initTelegram = (): TelegramWebApp | null => {
  if (typeof window === "undefined" || !window.Telegram) {
    console.warn("Telegram WebApp not available");
    return null;
  }

  const webApp = window.Telegram.WebApp;
  webApp.ready();

  // Expand app to fullscreen
  if (!webApp.isExpanded) {
    webApp.expand();
  }

  // Set theme colors to match our app
  webApp.setBackgroundColor("#0f172a");
  webApp.setHeaderColor("#1e293b");

  return webApp;
};

// Get Telegram user data
export const getTelegramUser = (): TelegramUser | null => {
  if (typeof window === "undefined" || !window.Telegram) {
    return null;
  }

  const webApp = window.Telegram.WebApp;
  return webApp.initDataUnsafe.user || null;
};

// Check if running in Telegram
export const isInTelegram = (): boolean => {
  return typeof window !== "undefined" && !!window.Telegram?.WebApp;
};

// Enable haptic feedback (vibration)
export const triggerHaptic = (
  type: "light" | "medium" | "heavy" | "rigid" | "soft" = "light",
) => {
  if (typeof window === "undefined" || !window.Telegram) {
    return;
  }

  window.Telegram.WebApp.hapticFeedback.impactOccurred(type);
};

// Trigger notification feedback (sound + vibration)
export const triggerNotification = (
  type: "error" | "success" | "warning" = "success",
) => {
  if (typeof window === "undefined" || !window.Telegram) {
    return;
  }

  window.Telegram.WebApp.hapticFeedback.notificationOccurred(type);
};

// Trigger selection feedback
export const triggerSelectionFeedback = () => {
  if (typeof window === "undefined" || !window.Telegram) {
    return;
  }

  window.Telegram.WebApp.hapticFeedback.selectionChanged();
};

// Save data to Telegram Cloud Storage
export const saveTelegramData = (key: string, value: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.Telegram) {
      reject(new Error("Telegram not available"));
      return;
    }

    window.Telegram.WebApp.CloudStorage.setItem(key, value, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

// Load data from Telegram Cloud Storage
export const loadTelegramData = (key: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.Telegram) {
      reject(new Error("Telegram not available"));
      return;
    }

    window.Telegram.WebApp.CloudStorage.getItem(key, (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    });
  });
};

// Get Telegram init data (for server validation)
export const getTelegramInitData = (): string | null => {
  if (typeof window === "undefined" || !window.Telegram) {
    return null;
  }

  return window.Telegram.WebApp.initData;
};

// Close the Telegram app
export const closeTelegramApp = () => {
  if (typeof window === "undefined" || !window.Telegram) {
    return;
  }

  window.Telegram.WebApp.close();
};
