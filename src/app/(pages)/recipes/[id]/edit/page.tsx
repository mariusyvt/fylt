"use client";

import { useRouter } from "next/navigation";
import HeaderAddRecipe from "@/components/add/HeaderAddRecipe";
import Loader from "@/components/Loader";
import { useRecipe } from "@/hooks/useRecipe";
import TextInput from "@/components/ui/TextInput";
import { useEditRecipe } from "@/hooks/useEditRecipe";
import FileButton from "@/components/ui/FileButton";
import SelectField from "@/components/ui/SelectField";
import PickerButton from "@/components/ui/PickerButton";
import { Clock, Users } from "lucide-react";
import { useEffect } from "react";
import { getRecipesTypes } from "@/api/services/recipes.service";
import { useAuth} from "@/context/AuthContext";
import IngredientsSection from "@/components/add/IngredientsSection";
import StepsSection from "@/components/add/StepsSection";
import { useNutrition } from "@/hooks/useNutrition";
import { useStep } from "@/hooks/useStep";
import PickerOverlay from "@/components/add/PickerOverlay";
import TimePicker from "@/components/add/TimePicker";
import PersonPicker from "@/components/add/PersonPicker";
import IngredientForm from "@/components/add/IngredientForm";
import StepForm from "@/components/add/StepForm";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import ConfirmButton from "@/components/add/ConfirmButton";

export default function EditPage() {
    const router = useRouter();
    const {token} = useAuth();

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
        removeIngredient
    } = useNutrition();

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
        setRecipeType,
        recipeType,
        activePicker,
        setActivePicker,
        errors
    } = useEditRecipe(recipes, ingredient, steps);

    const {scanning, isLoading, error, startScanner, stopScanner} = useBarcodeScanner(
        (scannedData) => {
            setScannedNutrients(scannedData);
            setIngredientName(scannedData.name);
        }
    );

    const handlePickerConfirm = () => {
        if (activePicker === "ingredient" && scannedNutrients !== null) addIngredient(scannedNutrients, Number(quantity), ingredientName);
        if (activePicker === "step") addStep();
        setActivePicker(null);
    };

    const handleConfirm = async () => {
        router.push(`/recipes/${id}`);
    }

    useEffect(() => {
        const fetchRecipes = async () => {
            if (token) {
                const result = await getRecipesTypes(token);
                setRecipeType(result.data);
            }
        };
        fetchRecipes();
    }, [token]);

    useEffect(() => {
        if (recipes?.recipe_ingredients && recipes.recipe_ingredients.length > 0 && recipes?.preparation_steps && recipes?.preparation_steps.length > 0) {
            setIngredient(recipes.recipe_ingredients);
            setSteps(recipes.preparation_steps)
        }
    }, [recipes]);

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
                activePicker={activePicker}
                onClose={() => setActivePicker(null)}
                onConfirm={handlePickerConfirm}
            >
                {activePicker === "time" && (
                    <TimePicker value={preparationTime} onChange={setPreparationTime} />
                )}
                {activePicker === "persons" && (
                    <PersonPicker initial={servings} onChange={setServings} />
                )}
                {activePicker === "ingredient" && (
                    <IngredientForm
                        ingredientName={ingredientName}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        scanning={scanning}
                        isLoading={isLoading}
                        error={error}
                        onStartScanner={startScanner}
                        onStopScanner={stopScanner}
                    />
                )}
                {activePicker === "step" && (
                    <StepForm
                        stepNumber={steps.length + 1}
                        stepDescription={stepDescription}
                        setStepDescription={setStepDescription}
                    />
                )}
            </PickerOverlay>

            <ConfirmButton onClick={handleConfirm} />

        </>
    )
}