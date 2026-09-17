import type { Metadata, Viewport } from "next";
import "@/styles/main.scss";
import AppShell from "./AppShell";

export const metadata: Metadata = {
    metadataBase: new URL("https://fylt.fr"),
    title: {
        default: "Fylt — Suivi nutritionnel et recettes",
        template: "%s · Fylt",
    },
    description:
        "Suivez vos calories et macros au quotidien, créez vos recettes et atteignez vos objectifs nutritionnels. Simple, rapide, installable sur votre téléphone.",
    applicationName: "Fylt",
    keywords: ["nutrition", "calories", "macros", "recettes", "suivi alimentaire", "fitness", "PWA"],
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        title: "Fylt",
        statusBarStyle: "black-translucent",
    },
    openGraph: {
        type: "website",
        siteName: "Fylt",
        title: "Fylt — Suivi nutritionnel et recettes",
        description:
            "Suivez vos calories et macros au quotidien, créez vos recettes et atteignez vos objectifs nutritionnels.",
        url: "https://fylt.fr",
        locale: "fr_FR",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Fylt — Suivi nutritionnel et recettes",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Fylt — Suivi nutritionnel et recettes",
        description:
            "Suivez vos calories et macros au quotidien, créez vos recettes et atteignez vos objectifs nutritionnels.",
        images: ["/og-image.png"],
    },
    icons: {
        icon: [
            { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
            { url: "/icons/fylt-logo-192x192.png", type: "image/png", sizes: "192x192" },
        ],
        shortcut: "/favicon-32.png",
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
