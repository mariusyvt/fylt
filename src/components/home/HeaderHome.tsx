import Link from "next/link";
import { Profile } from "@/types/profile.types";
import PageHeader from "@/components/ui/PageHeader";

interface HeaderHomeProps {
    profile: Profile | null;
}

export default function HeaderHome({ profile }: HeaderHomeProps){
    const title = profile?.gender === "female" ? "Cheffe" : "Chef";
    const photoProfile = profile?.firstName?.charAt(0).toUpperCase() || "?";

    return (
        <PageHeader
            eyebrow={`Bonjour, ${title} 👋`}
            title="Que cuisinez-vous ?"
            action={
                <Link href="/profile" className="profile-avatar">
                    {profile?.photo_url ? (
                        <img
                            src={profile.photo_url}
                            alt={`${profile.firstName} ${profile.lastName}`}
                        />
                    ) : (
                        <div className="avatar-circle">{photoProfile}</div>
                    )}
                </Link>
            }
        />
    );
}
