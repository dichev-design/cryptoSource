import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar">
            <h1>cryptoSource</h1>
            <div>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </div>
        </nav>
    );
}
