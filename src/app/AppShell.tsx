"use client";

import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import BottomNavbar from "@/components/BottomNavbar";
import DeviceGate from "@/components/landing/DeviceGate";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {children}
            {isAuthenticated && <BottomNavbar />}
        </>
    );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").catch(() => {});
        }
    }, []);

    return (
        <AuthProvider>
            <DeviceGate>
                <LayoutContent>{children}</LayoutContent>
            </DeviceGate>
        </AuthProvider>
    );
}
