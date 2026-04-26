import { Construction } from "lucide-react";

export default function Tracking() {
    return (
        <div className="mobile-container">
            <div className="bg-gradient-decor"></div>
            <div className="empty-state" style={{ marginTop: "8rem" }}>
                <Construction size={48} />
                <h2>En cours de développement</h2>
                <p>Le suivi nutritionnel arrive bientôt, reste connecté !</p>
            </div>
        </div>
    );
}
