import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const LEGAL_LINKS = [
    { href: "/legal/mentions-legales", label: "Mentions légales" },
    { href: "/legal/confidentialite", label: "Politique de confidentialité" },
    { href: "/legal/cgu", label: "Conditions d'utilisation" },
    { href: "/legal/cookies", label: "Cookies" },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="legal">
            <Link href="/" className="legal__back">
                <ArrowLeft size={16} />
                Retour à l'accueil
            </Link>

            {children}

            <nav className="legal__nav">
                {LEGAL_LINKS.map((link) => (
                    <Link key={link.href} href={link.href}>
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
