"use client";

import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { getSession, signOut } from '@/api/services/auth.service';

export interface AuthContextType {
    isAuthenticated: boolean;
    isReady: boolean;
    login: () => void;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null)

/**
 * Purge les caches du service worker (evite de servir des donnees API
 * d'une session precedente sur un appareil partage).
 */
const clearServiceWorkerCaches = () => {
    if (typeof caches === "undefined") return;
    caches.keys().then((keys) => keys.forEach((key) => caches.delete(key))).catch(() => {});
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // L'auth repose sur un cookie httpOnly (non lisible en JS) : on verifie
    // la session au demarrage en interrogeant une route protegee.
    useEffect(() => {
        let active = true;
        getSession()
            .then((ok) => {
                if (active) setIsAuthenticated(ok);
            })
            .finally(() => {
                if (active) setIsReady(true);
            });
        return () => {
            active = false;
        };
    }, []);

    const login = useCallback(() => {
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(async () => {
        try {
            await signOut();
        } catch {
        }
        setIsAuthenticated(false);
        clearServiceWorkerCaches();
    }, []);

    if (!isReady) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isReady, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
