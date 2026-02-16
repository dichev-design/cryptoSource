import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CapyBarra from "../assets/capybarra.png";
import "../styles/tapping-game-mobile.css";
import {
    initTelegram,
    getTelegramUser,
    isInTelegram,
    triggerHaptic,
    triggerNotification
} from "../services/telegramService";
import { claimCoinReward, syncGameData } from "../services/gameApi";

interface FloatingCoin {
    id: string;
    x: number;
    y: number;
}

export default function TappingGameMobile() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [coins, setCoins] = useState(0);
    const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([]);
    const [coinsPerTap] = useState(1);
    const [claimedRewards, setClaimedRewards] = useState(0);
    const [inTelegram] = useState(() => isInTelegram());
    const [telegramUser] = useState(() => getTelegramUser());

    const COINS_FOR_REWARD = 100000;
    const REWARD_AMOUNT = 10;

    // Get user ID or use guest ID
    const userId = user?.id || 'guest';
    const isGuest = !user;

    // Initialize Telegram
    useEffect(() => {
        if (inTelegram) {
            initTelegram();
            console.log('Telegram app initialized');
            console.log('Telegram user:', telegramUser);
        }
    }, [inTelegram, telegramUser]);

    // Load coins from localStorage
    useEffect(() => {
        const storageKey = `tapping_game_${userId}`;
        const stored = localStorage.getItem(storageKey);

        if (stored) {
            const gameData = JSON.parse(stored);
            setCoins(gameData.coins || 0);
            setClaimedRewards(gameData.claimedRewards || 0);
        }
    }, [userId]);

    // Save coins to localStorage and sync to server
    useEffect(() => {
        const storageKey = `tapping_game_${userId}`;
        localStorage.setItem(
            storageKey,
            JSON.stringify({
                coins,
                claimedRewards,
                lastUpdated: Date.now(),
            })
        );

        // Only sync to server if logged in
        if (!isGuest) {
            const syncInterval = setInterval(() => {
                syncGameData(userId, coins, claimedRewards).catch((err) => {
                    console.warn('Failed to sync game data:', err);
                });
            }, 10000);

            return () => clearInterval(syncInterval);
        }
    }, [coins, claimedRewards, userId, isGuest]);

    const processTap = (x: number, y: number) => {
        // Add coins
        setCoins((prev) => prev + coinsPerTap);

        // Haptic feedback
        triggerHaptic('light');

        // Create floating coin animation
        const coinId = crypto.randomUUID();
        setFloatingCoins((prev) => [...prev, { id: coinId, x, y }]);

        // Remove floating coin after animation
        setTimeout(() => {
            setFloatingCoins((prev) => prev.filter((c) => c.id !== coinId));
        }, 1000);
    };

    const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        processTap(x, y);
    };

    const handleTouchTap = (e: React.TouchEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        processTap(x, y);
    };

    const handleClaimReward = async () => {
        if (coins < COINS_FOR_REWARD) return;

        // If guest, redirect to login
        if (isGuest) {
            alert('Please login to claim your reward!');
            navigate('/login');
            return;
        }

        if (user) {
            try {
                // Call API to claim reward
                const response = await claimCoinReward(user.id, COINS_FOR_REWARD);

                if (response.success) {
                    setCoins((prev) => prev - COINS_FOR_REWARD);
                    setClaimedRewards((prev) => prev + REWARD_AMOUNT);

                    // Success feedback
                    triggerNotification('success');

                    alert(`Claimed $${REWARD_AMOUNT}! Added to your account balance.`);
                } else {
                    triggerNotification('error');
                    alert(response.message || 'Failed to claim reward');
                }
            } catch (error) {
                console.error('Error claiming reward:', error);
                triggerNotification('error');
                alert('Error claiming reward. Please try again.');
            }
        }
    };

    const getCharacterImage = () => {
        if (coins < 1000) return CapyBarra;
        if (coins < 50000) return CapyBarra;
        return CapyBarra; // Will be different images for different tiers
    };

    const remainingCoins = Math.max(0, COINS_FOR_REWARD - coins);
    const rewardProgress = (coins / COINS_FOR_REWARD) * 100;

    return (
        <div className="mobile-game-container">
            {/* COMPACT HEADER */}
            <div className="mobile-header">
                <div className="mobile-header-left">
                    <h1>CryptoSource</h1>
                    {inTelegram && (
                        <span className="telegram-badge">📱</span>
                    )}
                </div>
                {user && (
                    <button className="mobile-logout-btn" onClick={logout}>
                        Exit
                    </button>
                )}
            </div>

            {/* GAME CONTENT - FULL VIEWPORT */}
            <div className="mobile-game-content">
                {/* CHARACTER - SMALL */}
                <div className="mobile-character">
                    <img
                        src={getCharacterImage()}
                        alt="Capybara"
                        className="mobile-capybara"
                    />
                </div>

                {/* COIN COUNTER - PROMINENT */}
                <div className="mobile-coin-display">
                    <div className="mobile-coin-count">{coins.toLocaleString()}</div>
                    <div className="mobile-coin-label">coins</div>
                </div>

                {/* TAP AREA - LARGE & CENTERED */}
                <div
                    className="mobile-tap-area"
                    onClick={handleTap}
                    onTouchStart={handleTouchTap}
                    style={{ touchAction: 'manipulation' }}
                >
                    <div className="mobile-tap-circle">
                        <span className="mobile-tap-text">TAP!</span>
                    </div>

                    {/* Floating coins animation */}
                    {floatingCoins.map((coin) => (
                        <div
                            key={coin.id}
                            className="mobile-floating-coin"
                            style={{
                                left: `${coin.x}px`,
                                top: `${coin.y}px`,
                            }}
                        >
                            +{coinsPerTap}
                        </div>
                    ))}
                </div>

                {/* REWARD BUTTON & PROGRESS */}
                <div className="mobile-reward-container">
                    <div className="mobile-progress-bar">
                        <div
                            className="mobile-progress-fill"
                            style={{ width: `${Math.min(rewardProgress, 100)}%` }}
                        />
                    </div>
                    <div className="mobile-progress-text">
                        {coins >= COINS_FOR_REWARD ? (
                            <span className="mobile-ready">Ready to claim!</span>
                        ) : (
                            <span>{remainingCoins.toLocaleString()} more coins</span>
                        )}
                    </div>

                    {coins >= COINS_FOR_REWARD ? (
                        <button
                            className="mobile-claim-button active"
                            onClick={handleClaimReward}
                        >
                            💰 Claim ${REWARD_AMOUNT}
                        </button>
                    ) : (
                        <button className="mobile-claim-button disabled" disabled>
                            Earn to unlock
                        </button>
                    )}
                </div>

                {/* COMPACT STATS */}
                <div className="mobile-stats">
                    <div className="mobile-stat-item">
                        <span className="mobile-stat-label">CPS</span>
                        <span className="mobile-stat-value">{coinsPerTap}</span>
                    </div>
                    <div className="mobile-stat-item">
                        <span className="mobile-stat-label">Rewards</span>
                        <span className="mobile-stat-value">${claimedRewards}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


<script src="https://telegram.org/js/telegram-web-app.js"></script>
