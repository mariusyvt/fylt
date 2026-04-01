import { useState } from "react";

export const useCheckedSteps = () => {
    const [checkedSteps, setCheckedSteps] = useState<number[]>([]);

    const toggleStep = (index: number) => {
        setCheckedSteps(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return { checkedSteps, toggleStep };
};

