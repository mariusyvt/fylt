"use client";

import { X, Plus, ListChecks } from "lucide-react";
import { RecipeStep } from "@/types/recipes.types";
import { useCheckedSteps } from "@/hooks/useCheckedSteps";

interface StepsSectionProps {
    steps: RecipeStep[];
    onRemove: (index: number) => void;
    onAdd: () => void;
    onEdit?: (index: number) => void;
    readOnly?: boolean;
}

export default function StepsSection({
    steps,
    onRemove,
    onAdd,
    onEdit,
    readOnly = false,
}: StepsSectionProps) {

    const {checkedSteps, toggleStep} = useCheckedSteps();

    const activeIndex = steps.findIndex((_, i) => !checkedSteps.includes(i));

    return (
        <section className="steps-section">
            <h2 className="recipe-section-title">Étapes</h2>
            {readOnly && steps.length === 0 ? (
                <div className="empty-state">
                    <h2>Aucune étape</h2>
                    <p>Cette recette n&apos;a pas encore d&apos;étapes de préparation.</p>
                </div>
            ) : (
            <div className="timeline">
                {steps.map((step, index) => (
                    <div key={index} className={`step-item ${index === activeIndex ? "active" : ""}`}>
                        <div className="step-marker"></div>
                        <span className="step-number">Étape {index + 1}</span>
                        <div
                            className={`step-card ${onEdit ? "step-card--clickable" : ""}`}
                            onClick={onEdit ? () => onEdit(index) : undefined}
                            role={onEdit ? "button" : undefined}
                            tabIndex={onEdit ? 0 : undefined}
                        >
                            <p className={checkedSteps.includes(index) ? "step-done" : ""}>
                                {step.description}
                            </p>
                            {readOnly ?
                                <input
                                    type="checkbox"
                                    className="step-checkbox"
                                    checked={checkedSteps.includes(index)}
                                    onChange={() => toggleStep(index)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                :
                                <button
                                    className="remove-step-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove(index);
                                    }}
                                >
                                    <X size={14} />
                                </button>
                            }
                        </div>
                    </div>
                ))}
            </div>
            )}
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

