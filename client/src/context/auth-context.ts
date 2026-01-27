import { createContext, useContext } from "react";
import type { Role } from "../types/types";

interface AuthContextType {
    id: string;
    email: string;
    name: string;
    role: Role;
    isAuthenticated: boolean;
    isPending: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};