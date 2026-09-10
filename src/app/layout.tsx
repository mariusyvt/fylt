import type { Metadata, Viewport } from "next";
import "@/styles/main.scss";
import AppShell from "./AppShell";

export const metadata: Metadata = {
    title: "Fylt",
    description: "Suivi nutritionnel et recettes personnalisées",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        title: "Fylt",
        statusBarStyle: "black-translucent",
    },
    icons: {
        apple: "/icons/fylt-logo-192x192.webp",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: "#f0fdfa",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
        <body>
        <AppShell>{children}</AppShell>
        </body>
        </html>
    );
}
