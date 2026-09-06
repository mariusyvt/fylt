"use client"

import { Clock, Users } from "lucide-react";
import TimePicker from "@/components/add/TimePicker";
import PersonPicker from "@/components/add/PersonPicker";
import HeaderAddRecipe from "@/components/add/HeaderAddRecipe";
import IngredientsSection from "@/components/add/IngredientsSection";
import StepsSection from "@/components/add/StepsSection";
import IngredientFullScreen from "@/components/add/IngredientFullScreen";
import StepForm from "@/components/add/StepForm";
import PickerOverlay from "@/components/add/PickerOverlay";
import ConfirmButton from "@/components/add/ConfirmButton";
import TextInput from "@/components/ui/TextInput";
import SelectField from "@/components/ui/SelectField";
import PickerButton from "@/components/ui/PickerButton";
import FileButton from "@/components/ui/FileButton";
import { useRouter } from "next/navigation";
import { useNutrition } from "@/hooks/useNutrition";
import { useAddRecipe } from "@/hooks/useAddRecipe";
import { useStep } from "@/hooks/useStep";

export default function AddPage () {
    const router = useRouter();

    const {
        ingredient,
        scannedNutrients,
        setScannedNutrients,
        ingredientName,
        setIngredientName,
        quantity,
        setQuantity,
        addIngredient,
        removeIngredient
    } = useNutrition();

    const {
        steps,
        stepDescription,
        setStepDescription,
        addStep,
        removeStep
    } = useStep();

    const {
        photo,
        setPhoto,
        preparationTime,
        setPreparationTime,
        servings,
        setServings,
        title,
        setTitle,
        selectedRecipeTypeId,
        setSelectedRecipeTypeId,
        recipeType,
        activePicker,
        setActivePicker,
        handleSubmit,
        errors,
    } = useAddRecipe(ingredient, steps);


    const handlePickerConfirm = () => {
        if (activePicker === "ingredient" && scannedNutrients !== null) addIngredient(scannedNutrients, Number(quantity), ingredientName);
        if (activePicker === "step") addStep();
        setActivePicker(null);
    };

    const handleConfirm = async () => {
        const success = await handleSubmit();
        if (success) router.push("/");
    };

    return (
        <div className="add-recipe-page">
            <div className="mobile-container">
                <div className="bg-gradient-decor"></div>

                <HeaderAddRecipe onClose={() => router.push("/")} />

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

                    <FileButton value={photo} onChange={setPhoto} />

                    <SelectField
                        label="Type de plat"
                        value={selectedRecipeTypeId}
                        onChange={setSelectedRecipeTypeId}
                        options={recipeType.map((t) => ({ value: t.id, label: t.name }))}
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
                        onAdd={() => setActivePicker("ingredient")}
                    />
                    {errors.ingredients && <p className="error-message">{errors.ingredients}</p>}

                    <StepsSection
                        steps={steps}
                        onRemove={removeStep}
                        onAdd={() => setActivePicker("step")}
                    />
                    {errors.steps && <p className="error-message">{errors.steps}</p>}
                </main>

                <PickerOverlay
                    activePicker={activePicker === "ingredient" ? null : activePicker}
                    onClose={() => setActivePicker(null)}
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
                            stepNumber={steps.length + 1}
                            stepDescription={stepDescription}
                            setStepDescription={setStepDescription}
                        />
                    )}
                </PickerOverlay>

                <IngredientFullScreen
                    open={activePicker === "ingredient"}
                    onClose={() => setActivePicker(null)}
                    onConfirm={handlePickerConfirm}
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

                <ConfirmButton onClick={handleConfirm} />
            </div>
        </div>
    );
}
