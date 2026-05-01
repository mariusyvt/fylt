"use client"

import { Drumstick, Wheat, Droplet, Plus, Coffee, UtensilsCrossed, Moon, Apple } from "lucide-react";
import { useState } from "react";

// ── Fake data ──
const DAILY_GOAL = { calories: 2200, proteins: 150, carbs: 280, lipids: 75 };
const CONSUMED = { calories: 1450, proteins: 95, carbs: 180, lipids: 42 };

const MEALS = [
    {
        id: 1, slot: "Petit-déjeuner", icon: Coffee, items: [
            { name: "Porridge protéiné", calories: 350 },
            { name: "Banane", calories: 90 },
        ]
    },
    {
        id: 2, slot: "Déjeuner", icon: UtensilsCrossed, items: [
            { name: "Poulet grillé & riz", calories: 520 },
            { name: "Salade verte", calories: 45 },
        ]
    },
    {
        id: 3, slot: "Collation", icon: Apple, items: [
            { name: "Yaourt grec", calories: 120 },
        ]
    },
    {
        id: 4, slot: "Dîner", icon: Moon, items: [
            { name: "Saumon & légumes", calories: 325 },
        ]
    },
];

function CalorieRing({ consumed, goal }: { consumed: number; goal: number }) {
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

function MacroBar({ label, value, goal, color, icon: Icon }: {
    label: string; value: number; goal: number; color: string; icon: React.ElementType
}) {
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

// ── Week days ──
function getWeekDays() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const labels = ["L", "M", "M", "J", "V", "S", "D"];
    return labels.map((label, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return { label, date: d.getDate(), isToday: d.toDateString() === today.toDateString() };
    });
}

export default function Tracking() {
    const [expandedMeal, setExpandedMeal] = useState<number | null>(null);
    const weekDays = getWeekDays();
    const todayIndex = weekDays.findIndex((d) => d.isToday);
    const [selectedDay, setSelectedDay] = useState(todayIndex);

    return (
        <>
            <div className="bg-gradient-decor"></div>
            <div className="tracking-page">
                <header className="tracking-header">
                    <h1 className="tracking-title">Suivi du jour</h1>
                    <p className="tracking-date">
                        {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                </header>

                <section className="day-picker">
                    {weekDays.map((day, i) => (
                        <button
                            key={i}
                            className={`day-picker__btn ${selectedDay === i ? "active" : ""}`}
                            onClick={() => setSelectedDay(i)}
                        >
                            <span className="day-picker__label">{day.label}</span>
                            <span className="day-picker__date">{day.date}</span>
                        </button>
                    ))}
                </section>

                <section className="tracking-ring-section">
                    <CalorieRing consumed={CONSUMED.calories} goal={DAILY_GOAL.calories} />
                </section>

                <section className="tracking-macros-card">
                    <MacroBar label="Protéines" value={CONSUMED.proteins} goal={DAILY_GOAL.proteins} color="#0d9488" icon={Drumstick} />
                    <MacroBar label="Glucides" value={CONSUMED.carbs} goal={DAILY_GOAL.carbs} color="#f97316" icon={Wheat} />
                    <MacroBar label="Lipides" value={CONSUMED.lipids} goal={DAILY_GOAL.lipids} color="#8b5cf6" icon={Droplet} />
                </section>

                <section className="tracking-meals">
                    <h2 className="tracking-section-title">Repas</h2>
                    {MEALS.map((meal) => {
                        const mealCal = meal.items.reduce((s, i) => s + i.calories, 0);
                        const isOpen = expandedMeal === meal.id;
                        return (
                            <div key={meal.id} className="meal-card">
                                <button className="meal-card__header" onClick={() => setExpandedMeal(isOpen ? null : meal.id)}>
                                    <div className="meal-card__left">
                                        <div className="meal-card__icon">
                                            <meal.icon size={18} />
                                        </div>
                                        <span className="meal-card__slot">{meal.slot}</span>
                                    </div>
                                    <span className="meal-card__cal">{mealCal} kcal</span>
                                </button>
                                {isOpen && (
                                    <div className="meal-card__items">
                                        {meal.items.map((item, i) => (
                                            <div key={i} className="meal-item">
                                                <span className="meal-item__name">{item.name}</span>
                                                <span className="meal-item__cal">{item.calories} kcal</span>
                                            </div>
                                        ))}
                                        <button className="meal-add-btn">
                                            <Plus size={14} /> Ajouter
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </section>
            </div>
        </>
    );
}
