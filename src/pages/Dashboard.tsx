import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { DashboardData, Investment } from "../types/dashboard";

const getStorageKey = (userId: string) => `yao_user_data_${userId}`;


export default function Dashboard() {
    const { user, logout } = useAuth();
    const [data, setData] = useState<DashboardData>({
        balance: 0,
        investments: [],
    });

    const [initialized, setInitialized] = useState(false);
    const [depositAmount, setDepositAmount] = useState("");
    const [investAmount, setInvestAmount] = useState("");

    // Load user-specific dashboard data
    useEffect(() => {
        if (!user) return;

        const stored = localStorage.getItem(getStorageKey(user.id));

        if (stored) {
            setData(JSON.parse(stored));
        }

        setInitialized(true);
    }, [user]);

    // Persist changes
    useEffect(() => {
        if (!user || !initialized) return;

        localStorage.setItem(
            getStorageKey(user.id),
            JSON.stringify(data)
        );
    }, [data, user, initialized]);

    // Deposit logic
    const handleDeposit = () => {
        const amount = Number(depositAmount);
        if (!amount || amount <= 0) return;

        setData(prev => ({
            ...prev,
            balance: prev.balance + amount,
        }));

        setDepositAmount("");
    };

    // Invest logic
    const handleInvest = () => {
        const amount = Number(investAmount);
        if (!amount || amount <= 0) return;
        if (amount > data.balance) return;

        const newInvestment: Investment = {
            id: crypto.randomUUID(),
            amount,
            startDate: Date.now(),
            growthRate: 0.02, // 2% simulated daily
        };

        setData(prev => ({
            balance: prev.balance - amount,
            investments: [...prev.investments, newInvestment],
        }));

        setInvestAmount("");
    };

    const generateWalletAddress = () => {
        const chars = "abcdef0123456789";
        let address = "0x";
        for (let i = 0; i < 40; i++) {
            address += chars[Math.floor(Math.random() * chars.length)];
        }
        return address;
    };

    const handleConnectWallet = () => {
        if (data.walletAddress) return;

        const newAddress = generateWalletAddress();

        setData(prev => ({
            ...prev,
            walletAddress: newAddress,
        }));
    };

    // Simulated growth calculation
    const calculateGrowth = (investment: Investment) => {
        const days = (Date.now() - investment.startDate) / (1000 * 60 * 60 * 24);
        return investment.amount * (1 + investment.growthRate * days);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Welcome, {user?.username}</h1>

            <button onClick={logout}>Logout</button>

            <hr />

            <h2>Wallet</h2>

            {data.walletAddress ? (
                <div>
                    <p>Connected:</p>
                    <p style={{ fontWeight: "bold" }}>{data.walletAddress}</p>
                </div>
            ) : (
                <button onClick={handleConnectWallet}>
                    Connect Wallet
                </button>
            )}

            <h2>Balance: ${data.balance.toFixed(2)}</h2>

            <div style={{ marginTop: "1rem" }}>
                <h3>Deposit</h3>
                <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter amount"
                />
                <button onClick={handleDeposit}>Deposit</button>
            </div>

            <div style={{ marginTop: "1rem" }}>
                <h3>Invest</h3>
                <input
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    placeholder="Enter amount"
                />
                <button onClick={handleInvest}>Invest</button>
            </div>

            <hr />

            <h3>Your Investments</h3>

            {data.investments.length === 0 && <p>No investments yet.</p>}

            {data.investments.map((inv) => (
                <div key={inv.id} style={{ marginBottom: "1rem" }}>
                    <p>Initial: ${inv.amount.toFixed(2)}</p>
                    <p>Current Value: ${calculateGrowth(inv).toFixed(2)}</p>
                </div>
            ))}
        </div>
    );
}
