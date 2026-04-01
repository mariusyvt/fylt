"use client";

import { useRouter } from "next/navigation";
import HeaderAddRecipe from "@/components/add/HeaderAddRecipe";
import Loader from "@/components/Loader";
import { useRecipe } from "@/hooks/useRecipe";

export default function EditPage() {
    const router = useRouter();

    const {recipes,loading, id } = useRecipe()

    const handleConfirm = async () => {
        router.push(`/recipes/${id}`);

    }
    if (loading) return <Loader />;

    console.log("recipes",recipes);

    return (
        <>
            <HeaderAddRecipe
                onClose={() => router.push(`/recipes/${id}`)}
                onAdd={handleConfirm}
                isEditMode={true} />
        </>
    )
}