"use client";

import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
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
