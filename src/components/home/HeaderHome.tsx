import { Search } from "lucide-react";
import { Profiles } from "@/types/profiles.types";

interface HeaderHomeProps {
    profile: Profiles | null;
}

export default function HeaderHome({ profile }: HeaderHomeProps){
    const title = profile?.gender === "female" ? "Cheffe" : "Chef";

    return (
        <header className="main-header">
            <div className="header-text">
                <p className="welcome-msg">Bonjour, {title} 👋</p>
                <h2 className="main-title">Que cuisinez-vous ?</h2>
            </div>
            <button className="circle-btn">
                <Search size={20} />
            </button>
        </header>
    )
}