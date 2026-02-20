import React, { useEffect, useState } from "react";

type Props = {
    onComplete?: () => void;
    minDuration?: number;
    capybara?: string;
};

export default function Loader({ onComplete, minDuration = 2500, capybara = "/basic-plan.png" }: Props) {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const [fadingOut, setFadingOut] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));

        const startTime = Date.now();
        const id = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min(100, (elapsed / minDuration) * 100);
            setProgress(pct);

            if (pct >= 100) {
                clearInterval(id);
                setTimeout(() => setFadingOut(true), 200);
                setTimeout(() => {
                    setDone(true);
                    onComplete?.();
                }, 700);
            }
        }, 50);

        return () => clearInterval(id);
    }, [minDuration, onComplete]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!done) {
                console.warn("Loader fallback: forcing completion");
                onComplete?.();
            }
        }, 5000);
        return () => clearTimeout(timeout);
    }, [done, onComplete]);

    const overlayStyle: React.CSSProperties = {
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#071025",
        zIndex: 9999,
        opacity: visible && !fadingOut ? 1 : 0,
        transition: "opacity 500ms ease",
        pointerEvents: "auto"
    };

    const boxStyle: React.CSSProperties = {
        width: 480,
        maxWidth: "90%",
        padding: 24,
        borderRadius: 12,
        textAlign: "center",
        color: "white"
    };

    const capyStyle: React.CSSProperties = {
        width: 160,
        height: 160,
        objectFit: "contain",
        margin: "0 auto 12px",
        filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.6))"
    };

    const barOuter: React.CSSProperties = {
        height: 12,
        width: "100%",
        background: "#0f1a26",
        borderRadius: 8,
        overflow: "hidden",
        marginTop: 12
    };

    const barInner: React.CSSProperties = {
        height: "100%",
        width: `${progress}%`,
        background: `linear-gradient(90deg,#06b6d4,#7c3aed)`,
        transition: "width 150ms ease-out"
    };

    return (
        <div style={overlayStyle}>
            <div style={boxStyle}>
                <img src={capybara} alt="capybara" style={capyStyle} />
                <h2 style={{ margin: 0, marginBottom: 6, color: "#e6f6fb" }}>Capybara Loader</h2>
                <div style={{ color: "#9aa6b3", fontSize: 14 }}>
                    {progress < 33 ? "Initializing..." : progress < 66 ? "Loading..." : "Ready..."}
                </div>

                <div style={barOuter}>
                    <div style={barInner} />
                </div>

                <div style={{ marginTop: 8, fontSize: 13, color: "#9aa6b3" }}>
                    {Math.round(progress)}%
                </div>
            </div>
        </div>
    );
}