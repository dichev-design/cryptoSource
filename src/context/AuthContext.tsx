import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType, User } from "./types";

interface ExtendedAuthContextType extends AuthContextType {
    loading: boolean;
}

const AuthContext = createContext<ExtendedAuthContextType | undefined>(undefined);

const SESSION_KEY = "yao_session_user";
const USERS_KEY = "yao_registered_users";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Seed admin account
    useEffect(() => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

        const adminExists = users.some((u: any) => u.email === "admin");

        if (!adminExists) {
            users.push({
                id: "admin-id",
                username: "Admin",
                email: "admin",
                password: "admin",
            });

            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }

        const storedSession = localStorage.getItem(SESSION_KEY);
        if (storedSession) {
            setUser(JSON.parse(storedSession));
        }

        setLoading(false);
    }, []);

    const register = (username: string, email: string, password: string) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

        const newUser = {
            id: crypto.randomUUID(),
            username,
            email,
            password,
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        const sessionUser: User = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
    };

    const login = (email: string, password: string) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

        const foundUser = users.find(
            (u: any) => u.email === email && u.password === password
        );

        if (!foundUser) {
            throw new Error("Invalid credentials");
        }

        const sessionUser: User = {
            id: foundUser.id,
            username: foundUser.username,
            email: foundUser.email,
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
    };

    const logout = () => {
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return ctx;
}
