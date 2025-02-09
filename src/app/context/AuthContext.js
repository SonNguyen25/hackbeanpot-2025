"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // ✅ Ensure user is loaded from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            console.log("🔍 AuthContext: Loaded user from localStorage", JSON.parse(storedUser));
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // ✅ Login function: Stores user in state and localStorage
    const login = (userData) => {
        console.log("✅ AuthContext: Storing user", userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    // ✅ Logout function: Clears user from state and localStorage
    const logout = () => {
        console.log("🚪 AuthContext: Logging out...");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
