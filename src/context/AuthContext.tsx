import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType, User } from "./types";

interface ExtendedAuthContextType extends AuthContextType {
    loading: boolean;
}

const AuthContext = createContext<ExtendedAuthContextType | undefined>(undefined);

const STORAGE_KEY = "yao_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem(STORAGE_KEY);

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    const register = (username: string, email: string, password: string) => {
        const newUser: User = {
            id: crypto.randomUUID(),
            username,
            email,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        setUser(newUser);
    };

    const login = (email: string, password: string) => {
        const storedUser = localStorage.getItem(STORAGE_KEY);

        if (!storedUser) {
            throw new Error("No user found");
        }

        const parsedUser: User = JSON.parse(storedUser);

        if (parsedUser.email !== email) {
            throw new Error("Invalid credentials");
        }

        setUser(parsedUser);
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
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
