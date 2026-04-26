"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ChefHat, Plus, Heart, User, ChartNoAxesColumnIncreasing} from "lucide-react";

export default function BottomNavbar () {
    const pathname = usePathname();

    return (
        <nav className="bottom-nav">
            <div className="bottom-nav__content">
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
                <div className="bottom-nav__fab-wrapper">
                    <button className="bottom-nav__fab-btn">
                        <Link className="bottom-nav__add" href="/add">
                            <Plus />
                        </Link>
                    </button>
                </div>
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
        </nav>
    );
}
