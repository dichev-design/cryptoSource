import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import CapyBarra from "../assets/capybarra.png";
import "../styles/tapping-game.css";

interface FloatingCoin {
    id: string;
    x: number;
    y: number;
}

export default function TappingGame() {
    const { user, logout } = useAuth();
    const [coins, setCoins] = useState(0);
    const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([]);
    const [coinsPerTap] = useState(1);
    const [claimedRewards, setClaimedRewards] = useState(0);

    const COINS_FOR_REWARD = 100000;
    const REWARD_AMOUNT = 10;

    // Load coins from localStorage
    useEffect(() => {
        if (!user) return;

        const storageKey = `tapping_game_${user.id}`;
        const stored = localStorage.getItem(storageKey);

        if (stored) {
            const gameData = JSON.parse(stored);
            setCoins(gameData.coins || 0);
            setClaimedRewards(gameData.claimedRewards || 0);
        }
    }, [user]);

    // Save coins to localStorage
    useEffect(() => {
        if (!user) return;

        const storageKey = `tapping_game_${user.id}`;
        localStorage.setItem(
            storageKey,
            JSON.stringify({
                coins,
                claimedRewards,
                lastUpdated: Date.now(),
            })
        );
    }, [coins, claimedRewards, user]);

    const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Add coins
        setCoins((prev) => prev + coinsPerTap);

        // Create floating coin animation
        const coinId = crypto.randomUUID();
        setFloatingCoins((prev) => [...prev, { id: coinId, x, y }]);

        // Remove floating coin after animation
        setTimeout(() => {
            setFloatingCoins((prev) => prev.filter((c) => c.id !== coinId));
        }, 1000);
    };

    const handleClaimReward = () => {
        if (coins >= COINS_FOR_REWARD) {
            setCoins((prev) => prev - COINS_FOR_REWARD);
            setClaimedRewards((prev) => prev + REWARD_AMOUNT);

            // TODO: Call API to add $10 to website account
            alert(`Claimed $${REWARD_AMOUNT}! Added to your account balance.`);
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
            {/* HEADER */}
            <div className="tapping-header">
                <div className="header-content">
                    <h1>CryptoSource Tapper</h1>
                    <button className="logout-btn" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>

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
                <div className="tap-area" onClick={handleTap}>
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
                        <button
                            className="claim-button active"
                            onClick={handleClaimReward}
                        >
                            💰 Claim ${REWARD_AMOUNT} Reward
                        </button>
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

            {/* FOOTER */}
            <footer className="game-footer">
                <p>© 2026 CryptoSource | Tap Game</p>
            </footer>
        </div>
    );
}
