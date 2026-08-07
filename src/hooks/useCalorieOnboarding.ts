import { useMemo, useState } from "react";
import {
    ActivityLevel,
    Gender,
    calculateMacros,
    MacroTargets,
} from "@/utils/tdee.utils";

export interface OnboardingData {
    gender: Gender | null;
    age: string;
    weight: string;
    height: string;
    activity: ActivityLevel | null;
}

const INITIAL_DATA: OnboardingData = {
    gender: null,
    age: "",
    weight: "",
    height: "",
    activity: null,
};

export const TOTAL_STEPS = 5;

export const useCalorieOnboarding = (initial?: Partial<OnboardingData>) => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<OnboardingData>({ ...INITIAL_DATA, ...initial });
    const [result, setResult] = useState<MacroTargets | null>(null);

    const update = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) =>
        setData((prev) => ({ ...prev, [key]: value }));

    const isStepValid = useMemo(() => {
        switch (step) {
            case 0:
                return data.gender !== null;
            case 1:
                return Number(data.age) > 0 && Number(data.age) < 120;
            case 2:
                return Number(data.weight) > 0 && Number(data.weight) < 400;
            case 3:
                return Number(data.height) > 0 && Number(data.height) < 260;
            case 4:
                return data.activity !== null;
            default:
                return false;
        }
    }, [step, data]);

    const next = () => {
        if (!isStepValid) return;
        if (step < TOTAL_STEPS - 1) {
            setStep((s) => s + 1);
            return;
        }
        setResult(
            calculateMacros({
                gender: data.gender!,
                age: Number(data.age),
                weight: Number(data.weight),
                height: Number(data.height),
                activity: data.activity!,
            })
        );
    };

    const back = () => setStep((s) => Math.max(0, s - 1));

    const reset = () => {
        setStep(0);
        setData(INITIAL_DATA);
        setResult(null);
    };

    return {
        step,
        data,
        result,
        isStepValid,
        update,
        next,
        back,
        reset,
        progress: ((step + 1) / TOTAL_STEPS) * 100,
    };
};
