import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();

    return (
        <div>
            <nav
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem 2rem",
                    background: "rgba(15, 23, 42, 0.95)", // semi-transparent dark
                    backdropFilter: "blur(10px)",           // glassy effect
                    color: "white",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                }}
            >
                <Link
                    to="/"
                    style={{
                        textDecoration: "none",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        textShadow: "0 0 10px #22d3ee",
                    }}
                >
                    YAO Blockchain
                </Link>

                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                style={linkStyle}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                style={linkStyle}
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/dashboard"
                                style={linkStyle}
                            >
                                Dashboard
                            </Link>

                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                {/* Username pill */}
                                <span style={linkStyle}>{user.username}</span>

                                {/* Logout pill */}
                                <button
                                    onClick={logout}
                                    style={{
                                        ...accountPillStyle,   // inherit all styles
                                        border: "none",         // remove default button border
                                        background: accountPillStyle.background,
                                        font: "inherit",        // inherit font from span
                                        fontWeight: "bold",      // ensure bold text
                                        lineHeight: "inherit",  // match line height
                                        padding: accountPillStyle.padding,
                                        cursor: "pointer",
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = "scale(1.05)";
                                        e.currentTarget.style.boxShadow = "0 0 15px #facc15";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.boxShadow = "0 0 10px #facc15";
                                    }}
                                >
                                    Logout
                                </button>
                            </div>

                        </>
                    )}
                </div>
            </nav>

            <main>{children}</main>
        </div>
    );
}

const linkStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "white",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    transition: "all 0.2s",
    textShadow: "0 0 5px #22d3ee",
};

const accountPillStyle: React.CSSProperties = {
    padding: "0.4rem 1rem",
    borderRadius: "20px",
    background: "linear-gradient(90deg, #facc15, #22d3ee)",
    color: "#0f172a",
    fontWeight: "bold",
    boxShadow: "0 0 10px #facc15",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "center",
};
