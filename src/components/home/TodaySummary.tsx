import Link from "next/link";
import { ChevronRight, Target } from "lucide-react";
import { MacroSummary } from "@/types/tracking.types";

interface TodaySummaryProps {
    goal: MacroSummary | null;
    consumed: MacroSummary;
}

const MACROS = [
    { key: "proteins" as const, label: "Protéines", color: "#0d9488" },
    { key: "carbs" as const, label: "Glucides", color: "#f97316" },
    { key: "lipids" as const, label: "Lipides", color: "#8b5cf6" },
];

export default function TodaySummary({ goal, consumed }: TodaySummaryProps) {
    if (!goal) {
        return (
            <Link href="/tracking/onboarding" className="today-cta">
                <span className="today-cta__icon">
                    <Target size={20} />
                </span>
                <span className="today-cta__text">
                    <span className="today-cta__title">Définis ton objectif</span>
                    <span className="today-cta__sub">Calcule tes calories quotidiennes</span>
                </span>
                <ChevronRight size={20} className="today-cta__arrow" />
            </Link>
        );
    }

    const remaining = goal.calories - consumed.calories;
    const pct = Math.min((consumed.calories / goal.calories) * 100, 100);

    return (
        <Link href="/tracking" className="today-card">
            <div className="today-card__top">
                <span className="today-card__label">Aujourd&apos;hui</span>
                <span className="today-card__link">
                    Voir le suivi <ChevronRight size={14} />
                </span>
            </div>

            <div className="today-card__cal">
                <p className="today-card__calMain">
                    <span className="today-card__calValue">{consumed.calories}</span>
                    <span className="today-card__calGoal"> / {goal.calories} cal</span>
                </p>
                <p className="today-card__remaining">
                    {remaining} <span>restants</span>
                </p>
            </div>

            <div className="today-card__track">
                <div className="today-card__fill" style={{ width: `${pct}%` }} />
            </div>

            <div className="today-card__macros">
                {MACROS.map((m) => {
                    const value = consumed[m.key];
                    const target = goal[m.key];
                    const mPct = target > 0 ? Math.min((value / target) * 100, 100) : 0;
                    return (
                        <div key={m.key} className="today-macro">
                            <div className="today-macro__head">
                                <span className="today-macro__label">{m.label}</span>
                                <span className="today-macro__value">
                                    {value}<span className="today-macro__target">/{target}g</span>
                                </span>
                            </div>
                            <div className="today-macro__track">
                                <div
                                    className="today-macro__fill"
                                    style={{ width: `${mPct}%`, background: m.color }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </Link>
    );
}
