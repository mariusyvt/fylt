import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Profiles } from "@/types/profiles.types";
import { RecipeCategory } from "@/types/recipes.types";

interface HeaderProps {
    profile: Profiles;
    recipeTypes: RecipeCategory[];
    activeFilter: number | null;
    onFilterChange: (id: number | null) => void;
}

const FILTER_ORDER = ["Entrées", "Plats", "Desserts"];

export default function HeaderRecipes ({profile, recipeTypes, activeFilter, onFilterChange}:HeaderProps) {
    const photoProfile = profile.firstName.charAt(0).toUpperCase();

    const sortedRecipeTypes = [...recipeTypes].sort((a, b) => {
        const indexA = FILTER_ORDER.indexOf(a.name);
        const indexB = FILTER_ORDER.indexOf(b.name);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });

    return (
        <>
            <header className="sticky-recipes-header">
                <Link className="circle-btn" href="/"><ArrowLeft /></Link>
                <div className="header-right">
                    <Link href="/profile" className="profile-avatar">
                        {profile.photo_url ? (
                            <img
                                src={profile.photo_url}
                                alt={`${profile.firstName} ${profile.lastName}`}
                            />
                        ) : (
                            <div className="avatar-circle">{photoProfile}</div>
                        )}
                    </Link>
                </div>
            </header>
            <section className="page-intro">
                <h1 className="page-title">Recettes</h1>
                <div className="filter-bar no-scrollbar">
                    <button
                        className={`filter-pill ${activeFilter === null ? "active" : ""}`}
                        onClick={() => onFilterChange(null)}
                    >
                        Tout voir
                    </button>
                    {sortedRecipeTypes.map((type) => (
                        <button
                            key={type.id}
                            className={`filter-pill ${activeFilter === type.id ? "active" : ""}`}
                            onClick={() => onFilterChange(type.id)}
                        >
                            {type.name}
                        </button>
                    ))}
                </div>
            </section>
        </>
    );
}
