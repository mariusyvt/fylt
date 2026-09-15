"use client";

import { useRouter } from "next/navigation";
import HeaderAddRecipe from "@/components/add/HeaderAddRecipe";
import Loader from "@/components/Loader";
import { useRecipe } from "@/hooks/useRecipe";
import TextInput from "@/components/ui/TextInput";
import { useEditRecipe } from "@/hooks/useEditRecipe";
import FileButton from "@/components/ui/FileButton";
import Toast from "@/components/ui/Toast";
import SelectField from "@/components/ui/SelectField";
import PickerButton from "@/components/ui/PickerButton";
import { Clock, Users } from "lucide-react";
import { useEffect } from "react";
import IngredientsSection from "@/components/add/IngredientsSection";
import StepsSection from "@/components/add/StepsSection";
import { useNutrition } from "@/hooks/useNutrition";
import { useStep } from "@/hooks/useStep";
import PickerOverlay from "@/components/add/PickerOverlay";
import TimePicker from "@/components/add/TimePicker";
import PersonPicker from "@/components/add/PersonPicker";
import IngredientFullScreen from "@/components/add/IngredientFullScreen";
import StepForm from "@/components/add/StepForm";
import { useState } from "react";
import { editPreparationStep } from "@/api/services/recipes.service";
import { ApiError } from "@/types/api.types";

export default function EditPage() {
    const router = useRouter();

    const {recipes, loading, id} = useRecipe()

    const {
        ingredient,
        setIngredient,
        scannedNutrients,
        setScannedNutrients,
        ingredientName,
        setIngredientName,
        quantity,
        setQuantity,
        addIngredient,
        removeIngredient,
        editIngredient
    } = useNutrition();

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
    const [stepError, setStepError] = useState<string | null>(null);
    const [stepSaving, setStepSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        steps,
        setSteps,
        stepDescription,
        setStepDescription,
        addStep,
        removeStep
    } = useStep();

    const {
        title,
        setTitle,
        photo,
        setPhoto,
        photoUrl,
        preparationTime,
        setPreparationTime,
        setServings,
        servings,
        setSelectedRecipeTypeId,
        selectedRecipeTypeId,
        recipeType,
        activePicker,
        setActivePicker,
        errors,
        handleSubmit
    } = useEditRecipe(recipes, ingredient, steps, Number(id));

    const handlePickerConfirm = () => {
        if (activePicker === "ingredient" && scannedNutrients !== null) {
            if (editingIndex !== null) {
                editIngredient(editingIndex, scannedNutrients, Number(quantity), ingredientName);
            } else {
                addIngredient(scannedNutrients, Number(quantity), ingredientName);
            }
        }
        if (activePicker === "step") {
            if (editingStepIndex !== null) {
                void handleUpdateStep();
                return;
            }
            addStep();
        }
        setEditingIndex(null);
        setActivePicker(null);
    };

    const handleEditStep = (index: number) => {
        const target = steps[index];
        if (!target) return;
        setEditingStepIndex(index);
        setStepDescription(target.description);
        setStepError(null);
        setActivePicker("step");
    };

    const closeStepEdit = () => {
        setEditingStepIndex(null);
        setStepDescription("");
        setStepError(null);
        setActivePicker(null);
    };

    const handleUpdateStep = async () => {
        if (editingStepIndex === null || stepSaving) return;
        const target = steps[editingStepIndex];
        if (!target?.id) {
            setStepError("Étape introuvable, impossible de la mettre à jour.");
            return;
        }
        const description = stepDescription.trim();
        if (!description) {
            setStepError("La description ne peut pas être vide.");
            return;
        }
        if (description === target.description) {
            closeStepEdit();
            return;
        }
        setStepSaving(true);
        setStepError(null);
        try {
            await editPreparationStep(Number(id), target.id, { description });
            setSteps(
                steps.map((s, i) =>
                    i === editingStepIndex ? { ...s, description } : s
                )
            );
            closeStepEdit();
        } catch (err) {
            const apiError = err as ApiError;
            setStepError(apiError.message || "Impossible de mettre à jour l'étape.");
        } finally {
            setStepSaving(false);
        }
    };

    const handleEditIngredient = (index: number) => {
        const ing = ingredient[index];
        if (!ing) return;
        const qty = Number(ing.quantity) || 1;
        setScannedNutrients({
            name: ing.ingredient_name,
            calories: (parseFloat(ing.ingredient_calories) / qty) * 100,
            proteins: (parseFloat(ing.ingredient_proteins) / qty) * 100,
            carbs: (parseFloat(ing.ingredient_carbs) / qty) * 100,
            lipids: (parseFloat(ing.ingredient_lipids) / qty) * 100,
        });
        setIngredientName(ing.ingredient_name);
        setQuantity(ing.quantity);
        setEditingIndex(index);
        setActivePicker("ingredient");
    };

    const closeIngredient = () => {
        setEditingIndex(null);
        setScannedNutrients(null);
        setIngredientName("");
        setQuantity("");
        setActivePicker(null);
    };

    const handleConfirm = async () => {
        const success = await handleSubmit()
        if (success){
            setSuccessMessage("Recette mise à jour !");
            setTimeout(() => router.push(`/recipes/${id}`), 1200);
        }
    }

    useEffect(() => {
        if (recipes?.recipe_ingredients && recipes.recipe_ingredients.length > 0 && recipes?.preparation_steps && recipes?.preparation_steps.length > 0) {
            setIngredient(recipes.recipe_ingredients);
            setSteps(recipes.preparation_steps)
        }
    }, [recipes, setIngredient, setSteps]);

    if (loading) return <Loader />;


    return (
        <>
            <HeaderAddRecipe
                onClose={() => router.push(`/recipes/${id}`)}
                onAdd={handleConfirm}
                isEditMode={true}
            />

            <main className="form-content">
                <section className="intro-section">
                    <h1>Ma recette</h1>
                    <p>Partagez votre création culinaire</p>
                </section>

                <TextInput
                    label="Nom du plat"
                    value={title}
                    onChange={setTitle}
                    placeholder="Lasagnes maison"
                    error={errors.name}
                />

                <FileButton
                    value={photo}
                    onChange={setPhoto}
                    placeholder={photoUrl ? photoUrl.split("/").pop() : "Ajouter une photo"}
                />

                <SelectField
                    label="Type de plat"
                    value={selectedRecipeTypeId}
                    onChange={setSelectedRecipeTypeId}
                    options={recipeType.map((t) => ({value: t.id, label: t.name}))}
                    error={errors.recipe_type_id}
                />

                <div className="input-grid">
                    <PickerButton
                        label="Préparation"
                        value={preparationTime || "0 min"}
                        onClick={() => setActivePicker("time")}
                        icon={<Clock size={16} />}
                        error={errors.preparation_time_minutes}
                    />
                    <PickerButton
                        label="Portions"
                        value={`${servings ?? "–"} pers.`}
                        onClick={() => setActivePicker("persons")}
                        icon={<Users size={16} />}
                        error={errors.servings}
                    />
                </div>

                <IngredientsSection
                    ingredients={ingredient}
                    onRemove={removeIngredient}
                    onAdd={() => {
                        setEditingIndex(null);
                        setScannedNutrients(null);
                        setIngredientName("");
                        setQuantity("");
                        setActivePicker("ingredient");
                    }}
                    onEdit={handleEditIngredient}
                />
                {errors.ingredients && <p className="error-message">{errors.ingredients}</p>}

                <StepsSection
                    steps={steps}
                    onRemove={removeStep}
                    onAdd={() => setActivePicker("step")}
                    onEdit={handleEditStep}
                />
                {errors.steps && <p className="error-message">{errors.steps}</p>}
                {stepError && <p className="error-message">{stepError}</p>}
            </main>

            <PickerOverlay
                activePicker={activePicker === "ingredient" ? null : activePicker}
                onClose={activePicker === "step" && editingStepIndex !== null ? closeStepEdit : () => setActivePicker(null)}
                onConfirm={handlePickerConfirm}
            >
                {activePicker === "time" && (
                    <TimePicker value={preparationTime} onChange={setPreparationTime} />
                )}
                {activePicker === "persons" && (
                    <PersonPicker initial={servings} onChange={setServings} />
                )}
                {activePicker === "step" && (
                    <StepForm
                        stepNumber={editingStepIndex !== null ? editingStepIndex + 1 : steps.length + 1}
                        stepDescription={stepDescription}
                        setStepDescription={setStepDescription}
                    />
                )}
            </PickerOverlay>

            <IngredientFullScreen
                open={activePicker === "ingredient"}
                onClose={closeIngredient}
                onConfirm={handlePickerConfirm}
                isEdit={editingIndex !== null}
                ingredientName={ingredientName}
                nutrients={scannedNutrients}
                quantity={quantity}
                setQuantity={setQuantity}
                onSelectFood={(n) => {
                    setScannedNutrients(n);
                    setIngredientName(n.name);
                }}
                onClearFood={() => {
                    setScannedNutrients(null);
                    setIngredientName("");
                }}
            />
            {successMessage && <Toast message={successMessage} />}
        </>
    )
}