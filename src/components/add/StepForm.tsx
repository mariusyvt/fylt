"use client";

import TextArea from "@/components/ui/TextArea";

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
            <TextArea
                label={`Étape ${stepNumber}`}
                value={stepDescription}
                onChange={setStepDescription}
                placeholder="Décrivez cette étape..."
                rows={4}
            />
        </div>
    );
}
