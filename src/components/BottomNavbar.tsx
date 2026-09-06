"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ChefHat, Plus, User, ChartNoAxesColumnIncreasing } from "lucide-react";

export default function BottomNavbar() {
    const pathname = usePathname();

    return (
        <nav className="bottom-nav" aria-label="Navigation principale">
            <div className="bottom-nav__inner">
                <div className="bottom-nav__main">
                    <Link
                        href="/"
                        className={`bottom-nav__link ${pathname === "/" ? "bottom-nav__link--active" : ""}`}
                    >
                        <Home />
                        <span>Accueil</span>
                    </Link>
                    <Link
                        href="/recipes"
                        className={`bottom-nav__link ${pathname === "/recipes" ? "bottom-nav__link--active" : ""}`}
                    >
                        <ChefHat />
                        <span>Recettes</span>
                    </Link>
                    <Link
                        href="/tracking"
                        className={`bottom-nav__link ${pathname === "/tracking" ? "bottom-nav__link--active" : ""}`}
                    >
                        <ChartNoAxesColumnIncreasing />
                        <span>Suivis</span>
                    </Link>
                    <Link
                        href="/profile"
                        className={`bottom-nav__link ${pathname === "/profile" ? "bottom-nav__link--active" : ""}`}
                    >
                        <User />
                        <span>Profil</span>
                    </Link>
                </div>
                <Link
                    href="/add"
                    className={`bottom-nav__add-btn ${pathname === "/add" ? "bottom-nav__add-btn--active" : ""}`}
                    aria-label="Ajouter"
                >
                    <Plus />
                </Link>
            </div>
        </nav>
    );
}
