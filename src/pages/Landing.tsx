import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CapyBarra from "../assets/capybarra.png";
import Footer from "../components/Footer";
// serve team images from public/assets to avoid case-sensitivity/build issues
const ALICE = "/alice.jpg";
const BOB = "/bob.jpg";
const CHARLIE = "/charlie.jpg";

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

    // Stats
    const players = useCounter(12543);
    const invested = useCounter(482390);
    const rewards = useCounter(97321);

    // Investment plans
    const investmentPlans = [
        { name: "Basic", price: 50, roi: 1.2, description: "Starter plan for new players" },
        { name: "Standard", price: 200, roi: 2.5, description: "For regular investors" },
        { name: "Premium", price: 500, roi: 5, description: "High-tier, high rewards" },
    ];

    // Team members
    const team = [
        { name: "Alice", role: "CEO", image: ALICE },
        { name: "Bob", role: "Lead Developer", image: BOB },
        { name: "Charlie", role: "Designer", image: CHARLIE },
    ];

    // Roadmap items
    const roadmap = [
        { title: "Launch Beta", description: "Initial release with basic investments" },
        { title: "Add Gamified Features", description: "Floating coins, achievements, animations" },
        { title: "Full Launch", description: "Complete dashboard and landing page" },
        { title: "Mobile App", description: "Responsive mobile app for all users" },
        { title: "Global Expansion", description: "Reach international players and partnerships" },
    ];

    return (
        <div style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", color: "white" }}>

            {/* HERO SECTION */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative", // needed for coin animation
                padding: "4rem 2rem",
                textAlign: "center"
            }}>
                {/* Hero Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                    gap: "2rem",
                    alignItems: "center",
                    maxWidth: "1200px",
                    width: "100%",
                }}>
                    {/* LEFT SIDE */}
                    <div>
                        <h1 style={{
                            fontSize: "3rem",
                            marginBottom: "1rem",
                            background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>
                            Mine. Invest. Dominate.
                        </h1>
                        <p style={{ marginBottom: "2rem", fontSize: "1.2rem" }}>
                            Join Wick the most addictive blockchain investment simulator. Grow your balance, unlock rewards, and become a crypto tycoon.
                        </p>
                        <Link to="/register" style={{
                            padding: "0.8rem 1.5rem",
                            background: "linear-gradient(90deg, #06b6d4, #3b82f6)",
                            color: "white",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontWeight: "bold",
                            boxShadow: "0 0 15px rgba(6, 182, 212, 0.5)",
                            transition: "0.3s",
                            cursor: "pointer",
                        }}>
                            Start Mining
                        </Link>
                    </div>

                    {/* RIGHT SIDE */}
                    <div>
                        <img src={CapyBarra} alt="Game Character" style={{
                            width: "280px",
                            animation: "float 3s ease-in-out infinite",
                            transform: "scaleX(-1)",
                        }} />
                    </div>
                </div>

                {/* COIN ANIMATIONS */}
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                    {[...Array(10)].map((_, i) => (
                        <div key={i} style={{
                            position: "absolute",
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: "gold",
                            left: `${Math.random() * 90}%`,
                            top: `${Math.random() * 80}%`,
                            animation: `floatCoin ${3 + Math.random() * 2}s ease-in-out infinite`,
                            opacity: 0.8,
                            pointerEvents: "none",
                        }} />
                    ))}
                    <style>{`
      @keyframes floatCoin {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-50px) rotate(180deg); }
        100% { transform: translateY(0px) rotate(360deg); }
      }
    `}</style>
                </div>
            </div>

            {/* STATS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "2rem", textAlign: "center", padding: "2rem 0", maxWidth: "900px", margin: "0 auto" }}>
                <div><h2 style={{ color: "#06b6d4" }}>{players.toLocaleString()}</h2><p>Active Players</p></div>
                <div><h2 style={{ color: "#3b82f6" }}>${invested.toLocaleString()}</h2><p>Total Invested</p></div>
                <div><h2 style={{ color: "#4ade80" }}>${rewards.toLocaleString()}</h2><p>Rewards Paid</p></div>
            </div>

            {/* INVESTMENT OPTIONS */}
            <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
                <h2 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>Investment Options</h2>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
                    gap: "2rem",
                    maxWidth: "1200px",
                    margin: "0 auto"
                }}>
                    {investmentPlans.map((plan, idx) => (
                        <div key={idx}
                            style={{
                                background: "#1e293b",
                                padding: "2rem",
                                borderRadius: "16px",
                                boxShadow: "0 0 20px rgba(0,255,255,0.1)",
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                            }}
                            onMouseOver={(e) => {
                                const target = e.currentTarget as HTMLDivElement;
                                target.style.transform = "scale(1.05)";
                                target.style.boxShadow = "0 0 30px rgba(6,182,212,0.3)";
                            }}
                            onMouseOut={(e) => {
                                const target = e.currentTarget as HTMLDivElement;
                                target.style.transform = "scale(1)";
                                target.style.boxShadow = "0 0 20px rgba(0,255,255,0.1)";
                            }}
                        >
                            <h3 style={{ marginBottom: "0.5rem", color: "#06b6d4", fontSize: "1.8rem" }}>{plan.name}</h3>
                            <p style={{ marginBottom: "1rem" }}>{plan.description}</p>

                            <p><strong>ROI Daily:</strong> <span style={{ color: "#06b6d4", fontWeight: "bold" }}>{plan.roi}%</span></p>
                            <p><strong>Price:</strong> ${plan.price}</p>
                            <p><strong>Minimum Deposit:</strong> ${plan.price}</p>
                            <p><strong>Duration:</strong> {plan.roi > 2 ? "30 days" : "15 days"}</p>
                            <p><strong>Bonus Feature:</strong> {plan.roi > 2 ? "Extra reward coins" : "Starter bonus"}</p>

                            <Link to="/dashboard" style={{
                                marginTop: "1.5rem",
                                display: "inline-block",
                                padding: "0.7rem 1.5rem",
                                background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
                                color: "white",
                                borderRadius: "12px",
                                fontWeight: "bold",
                                textDecoration: "none",
                                transition: "all 0.3s",
                                boxShadow: "0 0 10px rgba(6, 182, 212, 0.5)"
                            }}
                                onMouseOver={(e) => {
                                    const target = e.currentTarget as HTMLAnchorElement;
                                    target.style.transform = "scale(1.05)";
                                    target.style.boxShadow = "0 0 20px rgba(6, 182, 212, 0.8)";
                                }}
                                onMouseOut={(e) => {
                                    const target = e.currentTarget as HTMLAnchorElement;
                                    target.style.transform = "scale(1)";
                                    target.style.boxShadow = "0 0 10px rgba(6, 182, 212, 0.5)";
                                }}
                            >
                                Deposit
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ padding: "4rem 2rem", background: "#0f172a", textAlign: "center" }}>
                <h2 style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>Road Map</h2>

                <div style={{
                    position: "relative",
                    maxWidth: "600px",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                    {/* Vertical line */}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: "50%",
                        width: "4px",
                        background: "#06b6d4",
                        transform: "translateX(-50%)",
                        borderRadius: "2px",
                    }}>
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "0%",
                            background: "linear-gradient(to bottom, #06b6d4, #3b82f6)",
                            animation: "lineGlow 3s forwards",
                        }}></div>
                    </div>

                    {roadmap.map((item, idx) => (
                        <div key={idx} style={{
                            position: "relative",
                            display: "flex",
                            justifyContent: idx % 2 === 0 ? "flex-start" : "flex-end", // zig-zag placement
                            width: "100%",
                            margin: "4rem 0",
                            opacity: 0,
                            animation: `fadeSlide 1s forwards ${idx * 0.5}s`,
                        }}>
                            {/* Circle marker on the line */}
                            <div style={{
                                position: "absolute",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                background: "#3b82f6",
                                border: "4px solid #06b6d4",
                                zIndex: 2,
                            }}></div>

                            {/* Task card */}
                            <div style={{
                                background: "#1e293b",
                                padding: "1rem 1.5rem",
                                borderRadius: "12px",
                                boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                                width: "250px",
                                marginLeft: idx % 2 === 0 ? "0" : "2rem", // spacing from line
                                marginRight: idx % 2 !== 0 ? "0" : "2rem",
                            }}>
                                <h3 style={{ marginBottom: "0.5rem", color: "#06b6d4" }}>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}

                    <style>{`
      @keyframes fadeSlide {
        0% { opacity: 0; transform: translateY(-20px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      @keyframes lineGlow {
        0% { height: 0%; box-shadow: none; }
        50% { height: 50%; box-shadow: 0 0 15px #06b6d4, 0 0 25px #3b82f6; }
        100% { height: 100%; box-shadow: 0 0 10px #06b6d4, 0 0 20px #3b82f6; }
      }
    `}</style>
                </div>
            </section>



            {/* TEAM */}
            <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
                <h2 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>Meet the Team</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "2rem", maxWidth: "900px", margin: "0 auto" }}>
                    {team.map((member, idx) => (
                        <div key={idx} style={{ background: "#1e293b", borderRadius: "12px", boxShadow: "0 8px 16px rgba(0,0,0,0.3)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                            {/* Image Container with fixed aspect ratio */}
                            <div style={{ width: "100%", height: "300px", overflow: "hidden" }}>
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        objectPosition: "center"
                                    }}
                                />
                            </div>
                            {/* Text Content */}
                            <div style={{ padding: "1.5rem" }}>
                                <h3 style={{ marginBottom: "0.5rem", marginTop: "0", color: "#06b6d4", fontSize: "1.3rem" }}>{member.name}</h3>
                                <p style={{ margin: "0", color: "#94a3b8", fontSize: "0.9rem" }}>{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <Footer />
        </div >
    );
}
