import { User, Mail, ChevronRight, LogOut } from "lucide-react";


interface ProfilMenuProps {
    handleLogout: () => void;
}

export default function ProfileMenu({handleLogout}: ProfilMenuProps) {
    return (
        <main className="profile-main">
            <label className="section-label">Paramètres</label>

            <button className="menu-item">
                <div className="menu-item-left">
                    <div className="icon-box teal">
                        <User />
                    </div>
                    <span className="menu-text">Mes informations</span>
                </div>
                <ChevronRight className="chevron" />
            </button>

            <button className="menu-item">
                <div className="menu-item-left">
                    <div className="icon-box orange">
                        <Mail />
                    </div>
                    <span className="menu-text">Nous contacter</span>
                </div>
                <ChevronRight className="chevron" />
            </button>

            <hr className="separator" />

            <button className="btn-primary logout-btn" onClick={handleLogout}>
                <LogOut />
                <span>Se déconnecter</span>
            </button>

            <button className="btn-danger">
                Supprimer mon compte
            </button>
        </main>
    );
}
