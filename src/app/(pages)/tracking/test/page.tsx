"use client";

import { Droplet, Drumstick, Wheat } from "lucide-react";
import { useTracking } from "@/hooks/useTracking";

export default function TrackingTestPage() {
    const { dailyGoal, consumed, weekDays, selectedDay, setSelectedDay } = useTracking();

    const calorieProgress = Math.min((consumed.calories / dailyGoal.calories) * 100, 100);

    const macros = [
        { label: "Protéines", value: consumed.proteins, goal: dailyGoal.proteins, colorClass: "teal", icon: Drumstick },
        { label: "Glucides", value: consumed.carbs, goal: dailyGoal.carbs, colorClass: "orange", icon: Wheat },
        { label: "Lipides", value: consumed.lipids, goal: dailyGoal.lipids, colorClass: "violet", icon: Droplet },
    ];

    return (
        <>
            <div className="bg-gradient-decor" />
            <div className="tracking-simple">
                <header className="tracking-header">
                    <h1 className="tracking-title">Suivi du jour</h1>
                    <p className="tracking-date">
                        {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                </header>

                <section className="tracking-simple__days" aria-label="Historique hebdomadaire">
                    {weekDays.map((day, i) => (
                        <button
                            key={`${day.label}-${day.date}`}
                            className={`tracking-simple__day-btn ${selectedDay === i ? "active" : ""}`}
                            onClick={() => setSelectedDay(i)}
                        >
                            <span className="tracking-simple__day-label">{day.label}</span>
                            <span className="tracking-simple__day-date">{day.date}</span>
                        </button>
                    ))}
                </section>

                <section className="tracking-simple__card">
                    <div className="tracking-simple__card-head">
                        <h2>Calories totales</h2>
                        <span>{consumed.calories} / {dailyGoal.calories} kcal</span>
                    </div>
                    <div className="tracking-simple__track">
                        <div className="tracking-simple__fill tracking-simple__fill--teal" style={{ width: `${calorieProgress}%` }} />
                    </div>
                </section>

                <section className="tracking-simple__card">
                    <div className="tracking-simple__card-head">
                        <h2>Macros</h2>
                    </div>
                    <div className="tracking-simple__macro-list">
                        {macros.map((macro) => {
                            const progress = Math.min((macro.value / macro.goal) * 100, 100);
                            return (
                                <div key={macro.label} className="tracking-simple__macro-row">
                                    <div className="tracking-simple__macro-head">
                                        <span className={`tracking-simple__macro-label tracking-simple__macro-label--${macro.colorClass}`}>
                                            <macro.icon size={14} />
                                            {macro.label}
                                        </span>
                                        <span>{macro.value} / {macro.goal} g</span>
                                    </div>
                                    <div className="tracking-simple__track">
                                        <div
                                            className={`tracking-simple__fill tracking-simple__fill--${macro.colorClass}`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </>
    );
}
