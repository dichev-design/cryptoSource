// Game API Service
// Handles all game-related API calls like coin claims and account linking

interface LinkAccountResponse {
  success: boolean;
  message: string;
  accountId?: string;
}

interface ClaimRewardResponse {
  success: boolean;
  message: string;
  newBalance?: number;
  depositAdded?: number;
}

interface GameDataResponse {
  coins: number;
  claimedRewards: number;
  lastUpdated: number;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Link Telegram account to website account
export const linkTelegramAccount = async (
  telegramId: number,
  telegramUsername: string,
  telegramInitData: string,
): Promise<LinkAccountResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/link-telegram`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        telegramId,
        telegramUsername,
        telegramInitData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to link account: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error linking Telegram account:", error);
    throw error;
  }
};

// Claim coin reward (converts 100k coins to $10 deposit)
export const claimCoinReward = async (
  userId: string,
  coins: number,
  telegramInitData?: string,
): Promise<ClaimRewardResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/claim-reward`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({
        userId,
        coins,
        telegramInitData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to claim reward: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error claiming reward:", error);
    throw error;
  }
};

// Save game progress to server
export const saveGameProgress = async (
  userId: string,
  coins: number,
  claimedRewards: number,
): Promise<GameDataResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/save-progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({
        userId,
        coins,
        claimedRewards,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save progress: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving progress:", error);
    throw error;
  }
};

// Load game progress from server
export const loadGameProgress = async (
  userId: string,
): Promise<GameDataResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/progress/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to load progress: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error loading progress:", error);
    return null;
  }
};

// Sync game data between Telegram Cloud Storage and server
export const syncGameData = async (
  userId: string,
  coins: number,
  claimedRewards: number,
): Promise<void> => {
  try {
    await saveGameProgress(userId, coins, claimedRewards);
  } catch (error) {
    console.warn("Failed to sync to server, using local storage:", error);
    // Fallback to local storage if server is unavailable
  }
};
