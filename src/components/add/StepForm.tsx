"use client";

interface StepFormProps {
    stepNumber: number;
    stepDescription: string;
    setStepDescription: (desc: string) => void;
}

export default function StepForm({
    stepNumber,
    stepDescription,
    setStepDescription,
}: StepFormProps) {
    return (
        <div className="step-form">
            <div className="input-group">
                <label className="field-label">Étape {stepNumber}</label>
                <textarea
                    className="text-input textarea"
                    placeholder="Décrivez cette étape..."
                    value={stepDescription}
                    onChange={(e) => setStepDescription(e.target.value)}
                    rows={4}
                />
            </div>
        </div>
    );
}

