import { useState } from "react";
import { RecipeStep } from "@/types/recipes.types";

export const useStep = () => {
    const [steps, setSteps] = useState<RecipeStep[]>([]);
    const [stepDescription, setStepDescription] = useState<string>("");


    const removeStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const addStep = () => {
        if (stepDescription.trim()) {
            setSteps([
                ...steps,
                {description: stepDescription, step_order: steps.length + 1}
            ]);
            setStepDescription("");
        }
    };

    return {
        steps,
        stepDescription,
        setStepDescription,
        addStep,
        removeStep,
    }
}