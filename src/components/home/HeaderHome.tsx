import { Search } from "lucide-react";
import { Profile } from "@/types/profile.types";
import PageHeader from "@/components/ui/PageHeader";

interface HeaderHomeProps {
    profile: Profile | null;
}

export default function HeaderHome({ profile }: HeaderHomeProps){
    const title = profile?.gender === "female" ? "Cheffe" : "Chef";

    return (
        <PageHeader
            eyebrow={`Bonjour, ${title} 👋`}
            title="Que cuisinez-vous ?"
            action={
                <button className="circle-btn" aria-label="Rechercher">
                    <Search size={20} />
                </button>
            }
        />
    );
}
