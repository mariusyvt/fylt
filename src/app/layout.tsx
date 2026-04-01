"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import "@/styles/main.scss";
import BottomNavbar from "@/components/BottomNavbar";

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
    return (
        <html lang="fr">
        <body>
        <AuthProvider>
            <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
        </body>
        </html>
    );
}
