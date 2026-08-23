"use client";

import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import "@/styles/main.scss";
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

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").catch(() => {});
        }
    }, []);

    return (
        <html lang="fr">
        <head>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#0d9488" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="FitMeal" />
            <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        </head>
        <body>
        <AuthProvider>
            <DeviceGate>
                <LayoutContent>{children}</LayoutContent>
            </DeviceGate>
        </AuthProvider>
        </body>
        </html>
    );
}
