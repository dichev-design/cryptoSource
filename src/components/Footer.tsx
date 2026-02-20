import React from "react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerStyle: React.CSSProperties = {
        background: "linear-gradient(180deg, #0f172a 0%, #051019 100%)",
        color: "#e2e8f0",
        borderTop: "1px solid #1e293b",
        padding: "60px 30px 20px",
        marginTop: "80px"
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: "1400px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "40px",
        marginBottom: "40px"
    };

    const sectionStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    };

    const titleStyle: React.CSSProperties = {
        fontSize: "16px",
        fontWeight: "700",
        color: "#06b6d4",
        marginBottom: "8px",
        textTransform: "uppercase",
        letterSpacing: "1px"
    };

    const linkStyle: React.CSSProperties = {
        color: "#94a3b8",
        textDecoration: "none",
        fontSize: "14px",
        cursor: "pointer",
        transition: "color 300ms ease"
    };

    const linkHoverStyle: React.CSSProperties = {
        ...linkStyle,
        color: "#06b6d4"
    };

    const socialIconStyle: React.CSSProperties = {
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1e293b",
        borderRadius: "8px",
        color: "#06b6d4",
        cursor: "pointer",
        transition: "all 300ms ease",
        fontSize: "18px",
        textDecoration: "none",
        border: "none"
    };

    const socialContainerStyle: React.CSSProperties = {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap"
    };

    const faqItemStyle: React.CSSProperties = {
        background: "#1e293b",
        padding: "12px",
        borderRadius: "6px",
        marginBottom: "8px"
    };

    const faqQuestionStyle: React.CSSProperties = {
        color: "#06b6d4",
        fontSize: "13px",
        fontWeight: "600",
        margin: "0 0 4px 0",
        cursor: "pointer"
    };

    const faqAnswerStyle: React.CSSProperties = {
        color: "#94a3b8",
        fontSize: "12px",
        margin: "0",
        lineHeight: "1.5"
    };

    const dividerStyle: React.CSSProperties = {
        height: "1px",
        background: "#1e293b",
        margin: "30px 0"
    };

    const bottomStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
        paddingTop: "20px",
        borderTop: "1px solid #1e293b",
        fontSize: "12px",
        color: "#64748b"
    };

    const logoStyle: React.CSSProperties = {
        fontSize: "24px",
        fontWeight: "700",
        background: "linear-gradient(90deg, #06b6d4, #7c3aed)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "8px"
    };

    return (
        <footer style={footerStyle}>
            <div style={containerStyle}>
                {/* ABOUT SECTION */}
                <div>
                    <div style={logoStyle}>CryptoSource</div>
                    <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6", margin: "8px 0 0 0" }}>
                        Your trusted crypto investment platform with real-time growth tracking.
                    </p>
                    <div style={{ ...sectionStyle, marginTop: "16px" }}>
                        <div style={titleStyle}>Follow Us</div>
                        <div style={socialContainerStyle}>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={socialIconStyle} title="Twitter">
                                𝕏
                            </a>
                            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" style={socialIconStyle} title="Telegram">
                                ✈
                            </a>
                            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" style={socialIconStyle} title="Discord">
                                💬
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={socialIconStyle} title="GitHub">
                                ⚙
                            </a>
                        </div>
                    </div>
                </div>

                {/* PRODUCTS SECTION */}
                <div style={sectionStyle}>
                    <div style={titleStyle}>Products</div>
                    <a style={linkStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}>
                        Dashboard
                    </a>
                    <a style={linkStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}>
                        Tapping Game
                    </a>
                    <a style={linkStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}>
                        Investment Plans
                    </a>
                    <a style={linkStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}>
                        Rewards Program
                    </a>
                    <a style={linkStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}>
                        Mobile App
                    </a>
                </div>

                {/* COMPANY SECTION */}
                <div style={sectionStyle}>
                    <div style={titleStyle}>Company</div>
                    <a style={linkStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}>
                        About Us
                    </a>
                    <a style={linkStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}>
                        Blog
                    </a>
                    <a style={linkStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}>
                        Careers
                    </a>
                    <a style={linkStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}>
                        Press
                    </a>
                    <a style={linkStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}>
                        Contact
                    </a>
                </div>

                {/* LEGAL SECTION */}
                <div style={sectionStyle}>
                    <div style={titleStyle}>Legal</div>
                    <a style={linkStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}>
                        Privacy Policy
                    </a>
                    <a style={linkStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}>
                        Terms of Service
                    </a>
                    <a style={linkStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}>
                        Cookie Policy
                    </a>
                    <a style={linkStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}>
                        Disclaimer
                    </a>
                    <a style={linkStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}>
                        GDPR
                    </a>
                </div>

                {/* FAQ SECTION */}
                <div style={sectionStyle}>
                    <div style={titleStyle}>FAQ</div>
                    <div style={faqItemStyle}>
                        <p style={faqQuestionStyle}>How do I start investing?</p>
                        <p style={faqAnswerStyle}>Sign up, deposit funds, and choose a plan.</p>
                    </div>
                    <div style={faqItemStyle}>
                        <p style={faqQuestionStyle}>Is my data secure?</p>
                        <p style={faqAnswerStyle}>Yes, bank-level encryption for all transactions.</p>
                    </div>
                    <div style={faqItemStyle}>
                        <p style={faqQuestionStyle}>When can I withdraw?</p>
                        <p style={faqAnswerStyle}>Anytime. Withdrawals process within 24 hours.</p>
                    </div>
                </div>
            </div>

            <div style={dividerStyle} />

            {/* BOTTOM BAR */}
            <div style={bottomStyle}>
                <div>© {currentYear} CryptoSource. All rights reserved.</div>
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <span>📍 San Francisco, CA</span>
                    <span>📧 support@cryptosource.com</span>
                    <span>🔐 SSL Secured</span>
                </div>
            </div>
        </footer>
    );
}
