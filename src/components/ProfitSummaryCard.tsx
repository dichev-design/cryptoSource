import React from "react";
import type { Investment } from "../types/dashboard";

type Props = {
    balance: number;
    investments: Investment[];
};

const currency = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

export default function ProfitSummaryCard({ balance, investments }: Props) {
    const now = Date.now();
    const secondsAgo = (ts: number) => (now - ts) / 1000;

    const currentValues = investments.map(inv => {
        const current = inv.amount + secondsAgo(inv.startDate) * inv.growthRate;
        return { ...inv, current };
    });

    const totalInvestmentsNow = currentValues.reduce((s, i) => s + i.current, 0);
    const totalBalance = balance + totalInvestmentsNow;
    const totalProfitLoss = currentValues.reduce((s, i) => s + (i.current - i.amount), 0);

    const total24hAgo = currentValues.reduce((s, i) => {
        const change24 = 24 * 3600 * i.growthRate;
        const value24Ago = i.current - change24;
        return s + value24Ago;
    }, 0);
    const change24h = totalBalance - (balance + total24hAgo);

    const perfList = currentValues.map(i => {
        const profit = i.current - i.amount;
        const pct = i.amount > 0 ? (profit / i.amount) * 100 : 0;
        return { id: i.id, name: (i as any).name || i.id, profit, pct, current: i.current };
    });

    const best = perfList.length ? perfList.reduce((a, b) => (b.pct > a.pct ? b : a)) : null;
    const worst = perfList.length ? perfList.reduce((a, b) => (b.pct < a.pct ? b : a)) : null;

    const cardStyle: React.CSSProperties = {
        background: "#0b1220",
        padding: "18px",
        borderRadius: "12px",
        color: "white",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)"
    };
    const labelStyle: React.CSSProperties = { color: "#94a3b8", fontSize: 13 };
    const valueStyle: React.CSSProperties = { color: "cyan", fontSize: 20, fontWeight: 700 };

    return (
        <div style={cardStyle}>
            <h3 style={{ margin: 0, marginBottom: 8 }}>Profit Summary</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                    <div style={labelStyle}>Total Balance</div>
                    <div style={valueStyle}>{currency(totalBalance)}</div>
                </div>

                <div>
                    <div style={labelStyle}>Total Profit / Loss</div>
                    <div style={{ ...valueStyle, color: totalProfitLoss >= 0 ? "lime" : "salmon" }}>
                        {totalProfitLoss >= 0 ? "+" : "-"}
                        {currency(Math.abs(totalProfitLoss))}
                    </div>
                </div>

                <div>
                    <div style={labelStyle}>24h Change</div>
                    <div style={{ ...valueStyle, color: change24h >= 0 ? "lime" : "salmon" }}>
                        {change24h >= 0 ? "+" : "-"}
                        {currency(Math.abs(change24h))}
                    </div>
                </div>

                <div>
                    <div style={labelStyle}>Invested (now)</div>
                    <div style={valueStyle}>{currency(totalInvestmentsNow)}</div>
                </div>
            </div>

            <div style={{ marginTop: 12, borderTop: "1px solid #10202b", paddingTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <div style={labelStyle}>Best Performer</div>
                        <div style={{ color: "lightgreen", fontWeight: 600 }}>
                            {best ? `${best.name} (${best.pct.toFixed(2)}%)` : "N/A"}
                        </div>
                    </div>

                    <div>
                        <div style={labelStyle}>Worst Performer</div>
                        <div style={{ color: "salmon", fontWeight: 600 }}>
                            {worst ? `${worst.name} (${worst.pct.toFixed(2)}%)` : "N/A"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}