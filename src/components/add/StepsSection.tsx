"use client";

import { X, Plus } from "lucide-react";
import { RecipeStep } from "@/types/recipes.types";
import { useCheckedSteps } from "@/hooks/useCheckedSteps";

interface StepsSectionProps {
    steps: RecipeStep[];
    onRemove: (index: number) => void;
    onAdd: () => void;
    readOnly?: boolean;
}

export default function StepsSection({
    steps,
    onRemove,
    onAdd,
    readOnly = false,
}: StepsSectionProps) {

    const {checkedSteps, toggleStep} = useCheckedSteps();

    const activeIndex = steps.findIndex((_, i) => !checkedSteps.includes(i));

    return (
        <section className="steps-section">
            <h2 className="recipe-section-title">Étapes</h2>
            <div className="timeline">
                {steps.map((step, index) => (
                    <div key={index} className={`step-item ${index === activeIndex ? "active" : ""}`}>
                        <div className="step-marker"></div>
                        <span className="step-number">Étape {index + 1}</span>
                        <div className="step-card">
                            <p className={checkedSteps.includes(index) ? "step-done" : ""}>
                                {step.description}
                            </p>
                            {readOnly ?
                                <input
                                    type="checkbox"
                                    className="step-checkbox"
                                    checked={checkedSteps.includes(index)}
                                    onChange={() => toggleStep(index)}
                                />
                                :
                                <button className="remove-step-btn" onClick={() => onRemove(index)}>
                                    <X size={14} />
                                </button>
                            }
                        </div>
                    </div>
                ))}
            </div>
            {readOnly ? null : <button
                className="btn-add-item"
                style={{marginTop: "1rem"}}
                onClick={onAdd}
            >
                <span>Ajouter une étape</span>
                <div className="plus-icon"><Plus size={16} /></div>
            </button>}

        </section>
    );
}

