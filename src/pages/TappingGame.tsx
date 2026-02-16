import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CapyBarra from "../assets/capybarra.png";
import "../styles/tapping-game.css";
import {
    initTelegram,
    getTelegramUser,
    isInTelegram,
    triggerHaptic,
    triggerNotification,
    applySafeAreaInsets
} from "../services/telegramService";
import { claimCoinReward, syncGameData } from "../services/gameApi";

interface FloatingCoin {
    id: string;
    x: number;
    y: number;
}

export default function TappingGame() {
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
            applySafeAreaInsets();
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
        <div className="tapping-game-container">
            {/* MAIN GAME AREA */}
            <div className="game-area">
                {/* CHARACTER */}
                <div className="character-section">
                    <img
                        src={getCharacterImage()}
                        alt="Capybara"
                        className="capybara-image"
                    />
                    <p className="character-name">Your Capybara</p>
                </div>

                {/* COIN COUNTER */}
                <div className="coin-counter">
                    <h2>
                        <span className="coin-icon">🪙</span>
                        {coins.toLocaleString()}
                    </h2>
                    <p className="coin-label">Coins Earned</p>
                </div>

                {/* TAPPABLE CIRCLE */}
                <div
                    className="tap-area"
                    onClick={handleTap}
                    onTouchStart={handleTouchTap}
                    style={{ touchAction: 'manipulation' }}
                >
                    <div className="tap-circle">
                        <span className="tap-text">TAP!</span>
                    </div>

                    {/* Floating coins animation */}
                    {floatingCoins.map((coin) => (
                        <div
                            key={coin.id}
                            className="floating-coin"
                            style={{
                                left: `${coin.x}px`,
                                top: `${coin.y}px`,
                            }}
                        >
                            +{coinsPerTap}
                        </div>
                    ))}
                </div>

                {/* REWARD PROGRESS */}
                <div className="reward-section">
                    <div className="progress-info">
                        <p className="progress-label">Progress to $10 Reward</p>
                        <p className="progress-amount">
                            {coins.toLocaleString()} / {COINS_FOR_REWARD.toLocaleString()} coins
                        </p>
                    </div>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${Math.min(rewardProgress, 100)}%` }}
                        />
                    </div>

                    {coins >= COINS_FOR_REWARD ? (
                        <>
                            <button
                                className="claim-button active"
                                onClick={handleClaimReward}
                            >
                                💰 Claim ${REWARD_AMOUNT} Reward
                            </button>
                            {isGuest && (
                                <p className="coins-needed" style={{ color: '#06b6d4', marginTop: '1rem' }}>
                                    Login to claim your reward!
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="coins-needed">
                            {remainingCoins.toLocaleString()} coins to go!
                        </p>
                    )}
                </div>

                {/* STATS */}
                <div className="stats-section">
                    <div className="stat">
                        <span className="stat-label">CPS</span>
                        <span className="stat-value">{coinsPerTap}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">Rewards Claimed</span>
                        <span className="stat-value">${claimedRewards}</span>
                    </div>
                </div>
            </div>

            {/* BACK BUTTON FOOTER */}
            <footer className="game-footer">
                <button
                    className="back-button"
                    onClick={() => navigate('/')}
                >
                    ← Back
                </button>
            </footer>
        </div>
    );
}
