interface MacroBarProps {
    label: string;
    value: number;
    goal: number;
    color: string;
    icon: React.ElementType;
}

export default function MacroBar({ label, value, goal, color, icon: Icon }: MacroBarProps) {
    const pct = Math.min((value / goal) * 100, 100);

    return (
        <div className="macro-bar">
            <div className="macro-bar__header">
                <Icon size={14} />
                <span className="macro-bar__label">{label}</span>
                <span className="macro-bar__values">{value}/{goal}g</span>
            </div>
            <div className="macro-bar__track">
                <div className="macro-bar__fill" style={{ width: `${pct}%`, background: color }} />
            </div>
        </div>
    );
}

