import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            login(email, password);
            navigate("/dashboard");
        } catch {
            setError("Invalid credentials");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#0f172a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem"
        }}>
            <form onSubmit={handleSubmit} style={{
                background: "#1e293b",
                padding: "2rem",
                borderRadius: "15px",
                boxShadow: "0 0 20px rgba(0,255,255,0.1)",
                width: "100%",
                maxWidth: "400px"
            }}>
                <h2 style={{ color: "white", marginBottom: "1.5rem", textAlign: "center" }}>Login</h2>
                {error && <p style={{ color: "#ef4444", marginBottom: "1rem", textAlign: "center" }}>{error}</p>}
                <input
                    placeholder="Email"
                    onChange={e => setEmail(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "1rem",
                        borderRadius: "8px",
                        border: "none",
                        background: "#0f172a",
                        color: "white",
                        fontSize: "16px",
                        outline: "none"
                    }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "1.5rem",
                        borderRadius: "8px",
                        border: "none",
                        background: "#0f172a",
                        color: "white",
                        fontSize: "16px",
                        outline: "none"
                    }}
                />
                <button className="primaryButton" style={{
                    width: "100%"
                }}>Login</button>
            </form>
        </div>
    );
}
