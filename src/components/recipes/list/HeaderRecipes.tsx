import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { Profiles } from "@/types/profiles.types";
import Image from "next/image";

interface HeaderProps {
    profile: Profiles;
}
export default function HeaderRecipes ({profile}:HeaderProps) {
    const photoProfile = profile.firstName.charAt(0).toUpperCase();
    return (
        <>
            <header className="sticky-recipes-header">
                <Link className="circle-btn" href="/"><ArrowLeft /></Link>
                <div className="header-right">
                    <button className="circle-btn">
                        <Search />
                    </button>
                    <Link href="/profile" className="profile-avatar">
                        {profile.photo_url ? (
                            <Image
                                src={profile.photo_url}
                                alt={`${profile.firstName} ${profile.lastName}`}
                                width={80}
                                height={80}
                                unoptimized
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
                    <button className="filter-pill active">Tout voir</button>
                    <button className="filter-pill">Entrées</button>
                    <button className="filter-pill">Plats</button>
                    <button className="filter-pill">Desserts</button>
                </div>
            </section>
        </>
    );
}
