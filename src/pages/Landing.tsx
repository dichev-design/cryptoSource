import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Landing() {
    // Animated counters hook
    const useCounter = (target: number, duration = 2000) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            let start = 0;
            const increment = target / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }, [target, duration]);

        return count;
    };

    // Animated stats
    const players = useCounter(12543);
    const invested = useCounter(482390);
    const rewards = useCounter(97321);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0f172a, #1e293b)",
                color: "white",
                display: "flex",
                flexDirection: "column", // stack hero + stats vertically
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "2rem",
            }}
        >
            {/* HERO GRID */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "2rem",
                    alignItems: "center",
                    maxWidth: "1200px",
                    width: "100%",
                }}
            >
                {/* LEFT SIDE - headline and CTA */}
                <div>
                    <h1
                        style={{
                            fontSize: "3rem",
                            marginBottom: "1rem",
                            background: "linear-gradient(90deg, #22d3ee, #facc15)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Mine. Invest. Dominate.
                    </h1>

                    <p style={{ marginBottom: "2rem", fontSize: "1.2rem" }}>
                        Join the most addictive blockchain investment simulator.
                        Grow your balance. Unlock rewards. Become a crypto tycoon.
                    </p>

                    <Link
                        to="/register"
                        style={{
                            padding: "0.8rem 1.5rem",
                            background: "#facc15",
                            color: "#0f172a",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Start Mining
                    </Link>
                </div>

                {/* RIGHT SIDE - character */}
                <div style={{ textAlign: "center" }}>
                    <img
                        src="/capybarra.png"
                        alt="Game Character"
                        style={{
                            width: "280px",
                            animation: "float 3s ease-in-out infinite",
                            // flipped horizontally via keyframes
                        }}
                    />
                </div>
            </div>

            <div style={{ position: "relative", width: "100%", height: "200px", marginTop: "-100px" }}>
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: "gold",
                            left: `${Math.random() * 90}%`,
                            animation: `floatCoin ${3 + Math.random() * 2}s ease-in-out infinite`,
                            opacity: 0.8,
                        }}
                    />
                ))}

                <style>
                    {`
      @keyframes floatCoin {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-50px) rotate(180deg); }
        100% { transform: translateY(0px) rotate(360deg); }
      }
    `}
                </style>
            </div>


            {/* STATS SECTION */}
            <div
                style={{
                    marginTop: "4rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "2rem",
                    textAlign: "center",
                    maxWidth: "900px",
                    width: "100%",
                }}
            >
                <div>
                    <h2 style={{ color: "#22d3ee" }}>{players.toLocaleString()}</h2>
                    <p>Active Players</p>
                </div>

                <div>
                    <h2 style={{ color: "#facc15" }}>${invested.toLocaleString()}</h2>
                    <p>Total Invested</p>
                </div>

                <div>
                    <h2 style={{ color: "#4ade80" }}>${rewards.toLocaleString()}</h2>
                    <p>Rewards Paid</p>
                </div>
            </div>

            {/* Floating Animation */}
            <style>
                {`
          @keyframes float {
            0% { transform: translateY(0px) scaleX(-1); }
            50% { transform: translateY(-15px) scaleX(-1); }
            100% { transform: translateY(0px) scaleX(-1); }
          }
        `}
            </style>
        </div>
    );
}
