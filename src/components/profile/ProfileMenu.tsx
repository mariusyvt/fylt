import { User, Mail, ChevronRight, LogOut, AlertTriangle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";


interface ProfilMenuProps {
    handleLogout: () => void;
    handleDeleteAccount: () => void;
}

export default function ProfileMenu({handleLogout, handleDeleteAccount}: ProfilMenuProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    const onConfirmDelete = () => {
        setShowConfirm(false);
        handleDeleteAccount();
    };

    return (
        <main className="profile-main">
            <label className="section-label">Paramètres</label>

            <Link href="/profile/informations" className="menu-item">
                <div className="menu-item-left">
                    <div className="icon-box teal">
                        <User />
                    </div>
                    <span className="menu-text">Mes informations</span>
                </div>
                <ChevronRight className="chevron" />
            </Link>

            <Link href="/profile/contact" className="menu-item">
                <div className="menu-item-left">
                    <div className="icon-box orange">
                        <Mail />
                    </div>
                    <span className="menu-text">Nous contacter</span>
                </div>
                <ChevronRight className="chevron" />
            </Link>

            <hr className="separator" />

            <button className="btn-primary logout-btn" onClick={handleLogout}>
                <LogOut />
                <span>Se déconnecter</span>
            </button>

            <button className="btn-danger" onClick={() => setShowConfirm(true)}>
                Supprimer mon compte
            </button>

            {showConfirm && (
                <div className="confirm-overlay" onClick={() => setShowConfirm(false)}>
                    <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="confirm-icon">
                            <AlertTriangle />
                        </div>
                        <h2 className="confirm-title">Supprimer le compte</h2>
                        <p className="confirm-text">
                            Cette action est irréversible. Toutes vos données, recettes et informations seront définitivement supprimées.
                        </p>
                        <div className="confirm-actions">
                            <button className="btn-cancel" onClick={() => setShowConfirm(false)}>
                                Annuler
                            </button>
                            <button className="btn-confirm-delete" onClick={onConfirmDelete}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
