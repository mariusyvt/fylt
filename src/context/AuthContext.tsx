import { createContext, ReactNode, useEffect, useState } from 'react';

export interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null)

/**
 * Vérifie qu'un token JWT n'est pas expiré (lecture du claim `exp`).
 * Renvoie true si le token ne peut pas être décodé (on ne bloque pas inutilement).
 */
const isTokenValid = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload?.exp) {
            return payload.exp * 1000 > Date.now();
        }
        return true;
    } catch {
        return true;
    }
};

export const AuthProvider = ({children}: {children : ReactNode}) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken && isTokenValid(storedToken)) {
            setToken(storedToken);
        } else if (storedToken) {
            // Token présent mais expiré/invalide → on nettoie
            localStorage.removeItem("token");
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return null;
    }

    const isAuthenticated = !!token;

    const login = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem("token", newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
    }

    return (
        <AuthContext.Provider value={{token, isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
