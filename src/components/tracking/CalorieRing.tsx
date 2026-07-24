interface CalorieRingProps {
    consumed: number;
    goal: number;
}

export default function CalorieRing({ consumed, goal }: CalorieRingProps) {
    const pct = Math.min(consumed / goal, 1);
    const r = 70;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - pct);

    return (
        <div className="calorie-ring">
            <svg viewBox="0 0 160 160" width="160" height="160">
                <circle cx="80" cy="80" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle
                    cx="80" cy="80" r={r} fill="none"
                    stroke="#0d9488" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 80 80)"
                />
            </svg>
            <div className="calorie-ring__inner">
                <span className="calorie-ring__value">{consumed}</span>
                <span className="calorie-ring__label">/ {goal} kcal</span>
            </div>
        </div>
    );
}

