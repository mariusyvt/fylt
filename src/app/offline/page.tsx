import { WifiOff } from "lucide-react";

export const metadata = {
    title: "Hors ligne — FitMeal",
};

export default function OfflinePage() {
    return (
        <div className="page-shell">
            <div className="bg-gradient-decor"></div>
            <div className="empty-state">
                <WifiOff size={48} />
                <h2>Vous êtes hors ligne</h2>
                <p>Vérifiez votre connexion internet puis réessayez.</p>
            </div>
        </div>
    );
}
