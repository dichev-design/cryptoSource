import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { DashboardData, Investment } from "../types/dashboard";
import ProfitSummaryCard from "../components/ProfitSummaryCard";
import Loader from "../components/Loader";
import Footer from "../components/Footer";

// images are in public/ (root), use root paths
const BASIC_CAPYBARA = "/basic-plan.png";
const SUIT_CAPYBARA = "/standard-plan.png";
const GOLD_CAPYBARA = "/premium-plan.png";

const getStorageKey = (userId: string) => `yao_user_data_${userId}`;

function DashboardContent() {
    const { user, logout } = useAuth();

    const [data, setData] = useState<DashboardData>({
        balance: 0,
        investments: [],
        walletAddress: ""
    });

    const [initialized, setInitialized] = useState(false);
    const [depositAmount, setDepositAmount] = useState("");
    const [investAmount, setInvestAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");

    // Load data
    useEffect(() => {
        if (!user) return;
        const stored = localStorage.getItem(getStorageKey(user.id));
        if (stored) setData(JSON.parse(stored));
        setInitialized(true);
    }, [user]);

    // Save data
    useEffect(() => {
        if (!user || !initialized) return;
        localStorage.setItem(getStorageKey(user.id), JSON.stringify(data));
    }, [data, user, initialized]);

    // Live refresh for growth visuals
    useEffect(() => {
        const interval = setInterval(() => setData(prev => ({ ...prev })), 1000);
        return () => clearInterval(interval);
    }, []);

    const safeRandomUUID = () =>
        typeof globalThis?.crypto?.randomUUID === "function"
            ? globalThis.crypto.randomUUID()
            : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;

    const calculateGrowth = (inv: Investment) => {
        const seconds = (Date.now() - inv.startDate) / 1000;
        return inv.amount + seconds * inv.growthRate;
    };

    const getTotalAvailable = () =>
        data.balance +
        data.investments.reduce((total, inv) => total + calculateGrowth(inv), 0);

    // Deposit
    const handleDeposit = () => {
        const amount = Number(depositAmount);
        if (!amount || amount <= 0) return;
        setData(prev => ({ ...prev, balance: prev.balance + amount }));
        setDepositAmount("");
    };

    // Invest
    const handleInvest = () => {
        const amount = Number(investAmount);
        if (!amount || amount <= 0) return;
        if (amount > data.balance) return;
        const newInvestment: Investment = {
            id: safeRandomUUID(),
            amount,
            startDate: Date.now(),
            growthRate: 0.02,
            plan: "standard"
        };
        setData(prev => ({
            ...prev,
            balance: prev.balance - amount,
            investments: [...prev.investments, newInvestment]
        }));
        setInvestAmount("");
    };

    // Withdraw
    const handleWithdraw = () => {
        const amount = Number(withdrawAmount);
        if (!amount || amount <= 0) return;
        const totalAvailable = getTotalAvailable();
        if (amount > totalAvailable) {
            alert("Not enough funds");
            return;
        }

        let remaining = amount;
        let newBalance = data.balance;

        if (newBalance >= remaining) {
            newBalance -= remaining;
            remaining = 0;
        } else {
            remaining -= newBalance;
            newBalance = 0;
        }

        const updatedInvestments = data.investments
            .map(inv => {
                if (remaining <= 0) return inv;
                const current = calculateGrowth(inv);
                if (current <= remaining) {
                    remaining -= current;
                    return null;
                }
                const keepValue = current - remaining;
                const keepPrincipalRatio = inv.amount / current;
                const newPrincipal = keepValue * keepPrincipalRatio;
                remaining = 0;
                return { ...inv, amount: newPrincipal, startDate: Date.now() };
            })
            .filter(Boolean) as Investment[];

        setData(prev => ({
            ...prev,
            balance: newBalance,
            investments: updatedInvestments
        }));

        setWithdrawAmount("");
    };

    // Character tier
    const getCharacterTier = () => {
        const totalInvested = data.investments.reduce((s, inv) => s + inv.amount, 0);
        if (totalInvested >= 500) {
            return {
                tier: "gold",
                name: "Gold Capybara",
                description: "You've unlocked the gold tier!",
                image: GOLD_CAPYBARA
            };
        }
        if (totalInvested >= 100) {
            return {
                tier: "suit",
                name: "Suit Capybara",
                description: "You've unlocked the suit tier!",
                image: SUIT_CAPYBARA
            };
        }
        return {
            tier: "basic",
            name: "Basic Capybara",
            description: "Welcome to the basic tier!",
            image: BASIC_CAPYBARA
        };
    };

    const generateWalletAddress = () => {
        const chars = "abcdef0123456789";
        let address = "0x";
        for (let i = 0; i < 40; i++) address += chars[Math.floor(Math.random() * chars.length)];
        return address;
    };

    const handleConnectWallet = () => {
        if (data.walletAddress) return;
        setData(prev => ({ ...prev, walletAddress: generateWalletAddress() }));
    };

    const handleRemoveWallet = () => setData(prev => ({ ...prev, walletAddress: "" }));

    const cardStyle: React.CSSProperties = {
        background: "#1e293b",
        padding: "25px",
        borderRadius: "15px",
        boxShadow: "0 0 20px rgba(0,255,255,0.1)",
        transition: "0.3s",
        wordBreak: "break-word",
        overflow: "hidden"
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "12px",
        marginTop: "10px",
        marginBottom: "10px",
        borderRadius: "8px",
        border: "none",
        outline: "none",
        background: "#0f172a",
        color: "white",
        fontSize: "16px"
    };

    const buttonStyle: React.CSSProperties = {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        background: "linear-gradient(90deg, cyan, blue)",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 0 10px cyan"
    };

    const character = getCharacterTier();

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#0f172a",
                color: "white",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}
        >
            <div>
                <h1>Welcome {user?.username}</h1>
                <button
                    className="primaryButton"
                    onClick={logout}
                    style={{
                        marginBottom: "20px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "none",
                        background: "red",
                        color: "white"
                    }}
                >
                    Logout
                </button>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
                        gap: "20px"
                    }}
                >
                    {/* PROFIT SUMMARY */}
                    <div style={{ minWidth: 0 }}>
                        <ProfitSummaryCard balance={data.balance} investments={data.investments} />
                    </div>

                    {/* WALLET */}
                    <div style={cardStyle}>
                        <h2>Wallet</h2>
                        {data.walletAddress ? (
                            <>
                                <p
                                    style={{
                                        wordBreak: "break-all",
                                        overflowWrap: "break-word",
                                        fontSize: "12px",
                                        fontFamily: "monospace",
                                        color: "#06b6d4",
                                        textAlign: "center",
                                        padding: "10px",
                                        background: "#0f172a",
                                        borderRadius: "8px",
                                        marginTop: "10px"
                                    }}
                                >
                                    {data.walletAddress}
                                </p>

                                <button
                                    style={{
                                        ...buttonStyle,
                                        background: "#ef4444",
                                        marginTop: "10px"
                                    }}
                                    onClick={handleRemoveWallet}
                                >
                                    Remove Wallet
                                </button>
                            </>
                        ) : (
                            <button style={buttonStyle} onClick={handleConnectWallet}>
                                Connect Wallet
                            </button>
                        )}
                    </div>

                    {/* BALANCE */}
                    <div style={cardStyle}>
                        <h2>Balance</h2>
                        <h1
                            style={{
                                color: "cyan",
                                textShadow: "0 0 15px cyan"
                            }}
                        >
                            ${getTotalAvailable().toFixed(2)}
                        </h1>
                    </div>

                    {/* CHARACTER */}
                    <div style={cardStyle}>
                        <h2>Your Character</h2>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                minHeight: "220px"
                            }}
                        >
                            <img
                                src={character.image}
                                alt={character.name}
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    objectFit: "contain",
                                    marginBottom: "10px"
                                }}
                            />

                            <h3
                                style={{
                                    color: "#06b6d4",
                                    marginBottom: "5px"
                                }}
                            >
                                {character.name}
                            </h3>

                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "#94a3b8",
                                    textAlign: "center"
                                }}
                            >
                                {character.description}
                            </p>
                        </div>
                    </div>

                    {/* DEPOSIT */}
                    <div style={cardStyle}>
                        <h2>Deposit</h2>
                        <input
                            style={inputStyle}
                            value={depositAmount}
                            onChange={e => setDepositAmount(e.target.value)}
                            placeholder="Amount"
                        />
                        <button style={buttonStyle} onClick={handleDeposit}>
                            Deposit
                        </button>
                    </div>

                    {/* INVEST */}
                    <div style={cardStyle}>
                        <h2>Invest</h2>
                        <input
                            style={inputStyle}
                            value={investAmount}
                            onChange={e => setInvestAmount(e.target.value)}
                            placeholder="Amount"
                        />
                        <button style={buttonStyle} onClick={handleInvest}>
                            Invest
                        </button>
                    </div>

                    {/* WITHDRAW */}
                    <div style={cardStyle}>
                        <h2>Withdraw</h2>
                        <input
                            style={inputStyle}
                            value={withdrawAmount}
                            onChange={e => setWithdrawAmount(e.target.value)}
                            placeholder="Amount"
                        />
                        <button style={buttonStyle} onClick={handleWithdraw}>
                            Withdraw
                        </button>
                    </div>

                    {/* INVESTMENTS */}
                    <div style={cardStyle}>
                        <h2>Investments</h2>
                        {data.investments.length === 0 ? (
                            <p style={{ color: "#94a3b8" }}>No investments yet</p>
                        ) : (
                            data.investments.map(inv => {
                                const current = calculateGrowth(inv);
                                const profit = current - inv.amount;
                                return (
                                    <div key={inv.id} style={{ marginBottom: "12px" }}>
                                        <p>${current.toFixed(2)}</p>
                                        <p
                                            style={{
                                                color: profit >= 0 ? "lime" : "salmon",
                                                textShadow: profit >= 0 ? "0 0 10px lime" : "0 0 10px salmon"
                                            }}
                                        >
                                            {profit >= 0 ? "+" : "-"}${Math.abs(profit).toFixed(2)}
                                        </p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [showLoader, setShowLoader] = useState(true);

    const handleLoaderComplete = () => setShowLoader(false);

    if (showLoader) {
        return <Loader onComplete={handleLoaderComplete} minDuration={2500} capybara={BASIC_CAPYBARA} />;
    }

    return <DashboardContent />;
}
