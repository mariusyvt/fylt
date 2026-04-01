"use client"

import { useEffect, useState } from "react";
import {
    PlusCircle,
    ChevronsUpDown,
    Clock,
    Users,
} from "lucide-react";
import TimePicker from "@/components/add/TimePicker";
import PersonPicker from "@/components/add/PersonPicker";
import HeaderAddRecipe from "@/components/add/HeaderAddRecipe";
import IngredientsSection from "@/components/add/IngredientsSection";
import StepsSection from "@/components/add/StepsSection";
import IngredientForm from "@/components/add/IngredientForm";
import StepForm from "@/components/add/StepForm";
import PickerOverlay from "@/components/add/PickerOverlay";
import ConfirmButton from "@/components/add/ConfirmButton";
import { getRecipesTypes } from "@/api/services/recipes.service";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { RecipeCategory } from "@/types/recipes.types";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { useNutrition } from "@/hooks/useNutrition";
import { useAddRecipe } from "@/hooks/useAddRecipe";
import { useStep } from "@/hooks/useStep";

type PickerType = "time" | "persons" | "ingredient" | "step" | null;

export default function AddPage () {
    const {token} = useAuth();
    const router = useRouter();
    const [recipeType, setRecipeType] = useState<RecipeCategory[]>([]);
    const [activePicker, setActivePicker] = useState<PickerType>(null);
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
    } = useStep()

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
        handleSubmit,
        errors,
    } = useAddRecipe(ingredient, steps)

    const {scanning, isLoading, error, startScanner, stopScanner} = useBarcodeScanner(
        (scannedData) => {
            setScannedNutrients(scannedData);
            setIngredientName(scannedData.name)
        }
    );

    useEffect(() => {
        const fetchRecipes = async () => {
            if (token) {
                const result = await getRecipesTypes(token);
                setRecipeType(result.data);
            }
        };

        fetchRecipes();
    }, [token]);


    const formatTime = () => {
        return preparationTime || "0 min";
    };


    const handlePickerConfirm = () => {
        if (activePicker === "ingredient" && scannedNutrients !== null) addIngredient(scannedNutrients, Number(quantity), ingredientName);
        if (activePicker === "step") addStep();
        setActivePicker(null);
    };

    const handleConfirm = async () => {
        const success = await handleSubmit();
        if(success) router.back()
    };

    return (
        <div className="add-recipe-page">
            <div className="mobile-container">
                <div className="bg-gradient-decor"></div>

                <HeaderAddRecipe onClose={() => router.back()} />

                <main className="form-content">
                    <section className="intro-section">
                        <h1>Ma recette</h1>
                        <p>Partagez votre création culinaire</p>
                    </section>

                    <div>
                        <label className="field-label">Nom du plat</label>
                        <input type="text" className="text-input" value={title}
                               onChange={(e) => setTitle(e.target.value)} placeholder="Lasagnes maison" />
                        {errors.name && <p className="error-message">{errors.name}</p>}

                    </div>

                    <label  className="btn-dark">
                        <input
                            type="file"
                            name="fichier"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setPhoto(file)
                            }}
                            style={{ display: 'none' }}
                        />
                        <span>{photo ? photo.name : "Ajouter une photo"}</span>
                        <PlusCircle size={20} />
                    </label>

                    <div>
                        <label className="field-label">Type de plat</label>
                        <div className="select-wrapper">
                            <select
                                className="text-input select-native"
                                value={selectedRecipeTypeId}
                                onChange={(e) => setSelectedRecipeTypeId(e.target.value)}
                            >
                                <option value="" disabled hidden>Choisir</option>
                                {recipeType.map((type) => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                            <ChevronsUpDown size={16} className="select-icon" />
                        </div>
                        {errors.recipe_type_id && <p className="error-message">{errors.recipe_type_id}</p>}
                    </div>

                    <div className="input-grid">
                        <div>
                            <label className="field-label">Préparation</label>
                            <button className="select-input" onClick={() => setActivePicker("time")}>
                                <span>{formatTime()}</span>
                                <Clock size={16} />
                            </button>
                            {errors.preparation_time_minutes && <p className="error-message">{errors.preparation_time_minutes}</p>}

                        </div>
                        <div>
                            <label className="field-label">Portions</label>
                            <button className="select-input" onClick={() => setActivePicker("persons")}>
                                <span>{servings} pers.</span>
                                <Users size={16} />
                            </button>
                            {errors.servings && <p className="error-message">{errors.servings}</p>}
                        </div>
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
                    onClose={() => {
                        setActivePicker(null)
                    }
                    }
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
                            setIngredientName={setIngredientName}
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
            </div>
        </div>
    );
}
