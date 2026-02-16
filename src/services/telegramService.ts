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

  try {
    // Signal that the app is ready
    webApp.ready();

    // Expand app to fullscreen (use all available space)
    if (!webApp.isExpanded) {
      webApp.expand();
    }

    // Request fullscreen mode (additional immersive experience)
    if (webApp.requestFullscreen && !window.document.fullscreenElement) {
      webApp.requestFullscreen();
    }

    // Set theme colors to match our app
    webApp.setBackgroundColor("#0f172a");
    webApp.setHeaderColor("#1e293b");
    webApp.setBottomBarColor("#0f172a");

    // Disable vertical swipes to prevent interference with game
    if (webApp.isVerticalSwipesEnabled !== undefined) {
      webApp.isVerticalSwipesEnabled = false;
    }

    // Set header color to match
    try {
      webApp.setHeaderColor("rgb(30, 41, 59)");
    } catch (e) {
      // Fallback if setHeaderColor not available
      webApp.setHeaderColor("#1e293b");
    }

    // Log viewport info for debugging
    console.log("Telegram initialized:", {
      isExpanded: webApp.isExpanded,
      viewportHeight: webApp.viewportHeight,
      viewportStableHeight: webApp.viewportStableHeight,
      safeAreaInset: webApp.safeAreaInset,
      platform: webApp.platform,
    });

    return webApp;
  } catch (error) {
    console.error("Error initializing Telegram:", error);
    return webApp;
  }
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

// Get viewport dimensions
export const getTelegramViewport = () => {
  if (typeof window === "undefined" || !window.Telegram) {
    return { height: window.innerHeight, stableHeight: window.innerHeight };
  }

  const webApp = window.Telegram.WebApp;
  return {
    height: webApp.viewportHeight,
    stableHeight: webApp.viewportStableHeight,
    isExpanded: webApp.isExpanded,
  };
};

// Get safe area insets (for notches, status bars, etc.)
export const getSafeAreaInsets = () => {
  if (typeof window === "undefined" || !window.Telegram) {
    return { top: 0, left: 0, bottom: 0, right: 0 };
  }

  const webApp = window.Telegram.WebApp;
  return webApp.safeAreaInset || { top: 0, left: 0, bottom: 0, right: 0 };
};

// Get content safe area insets
export const getContentSafeAreaInsets = () => {
  if (typeof window === "undefined" || !window.Telegram) {
    return { top: 0, left: 0, bottom: 0, right: 0 };
  }

  const webApp = window.Telegram.WebApp;
  return (
    webApp.contentSafeAreaInset || { top: 0, left: 0, bottom: 0, right: 0 }
  );
};

// Apply safe area CSS variables to root element
export const applySafeAreaInsets = () => {
  if (typeof window === "undefined" || !window.Telegram) {
    return;
  }

  const insets = getSafeAreaInsets();
  const root = document.documentElement;

  // Set CSS variables for safe area
  root.style.setProperty("--safe-area-inset-top", `${insets.top}px`);
  root.style.setProperty("--safe-area-inset-right", `${insets.right}px`);
  root.style.setProperty("--safe-area-inset-bottom", `${insets.bottom}px`);
  root.style.setProperty("--safe-area-inset-left", `${insets.left}px`);

  console.log("Safe area insets applied:", insets);
};

// Close the Telegram app
export const closeTelegramApp = () => {
  if (typeof window === "undefined" || !window.Telegram) {
    return;
  }

  window.Telegram.WebApp.close();
};
