"use client"

import { Drumstick, Wheat, Droplet, Plus, Coffee, UtensilsCrossed, Moon, Apple, ChevronDown } from "lucide-react";
import { useState } from "react";

// ── Fake data ──
const DAILY_GOAL = { calories: 2200, proteins: 150, carbs: 280, lipids: 75 };
const CONSUMED = { calories: 1450, proteins: 95, carbs: 180, lipids: 42 };

const MEALS = [
    {
        id: 1, slot: "Petit-déjeuner", icon: Coffee, items: [
            { name: "Porridge protéiné", calories: 350, proteins: 25, carbs: 45, lipids: 8 },
            { name: "Banane", calories: 90, proteins: 1, carbs: 23, lipids: 0 },
        ]
    },
    {
        id: 2, slot: "Déjeuner", icon: UtensilsCrossed, items: [
            { name: "Poulet grillé & riz", calories: 520, proteins: 42, carbs: 55, lipids: 12 },
            { name: "Salade verte", calories: 45, proteins: 2, carbs: 8, lipids: 1 },
        ]
    },
    {
        id: 3, slot: "Collation", icon: Apple, items: [
            { name: "Yaourt grec", calories: 120, proteins: 12, carbs: 8, lipids: 5 },
        ]
    },
    {
        id: 4, slot: "Dîner", icon: Moon, items: [
            { name: "Saumon & légumes", calories: 325, proteins: 13, carbs: 41, lipids: 16 },
        ]
    },
];

function SemiCircleGauge({ consumed, goal }: { consumed: number; goal: number }) {
    const pct = Math.min(consumed / goal, 1);
    const r = 80;
    const halfCircumference = Math.PI * r;
    const offset = halfCircumference * (1 - pct);
    const remaining = goal - consumed;

    return (
        <div className="semi-gauge">
            <svg viewBox="0 0 200 110" width="200" height="110">
                <path
                    d="M 10 100 A 80 80 0 0 1 190 100"
                    fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round"
                />
                <path
                    d="M 10 100 A 80 80 0 0 1 190 100"
                    fill="none" stroke="#0d9488" strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={halfCircumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="semi-gauge__info">
                <span className="semi-gauge__value">{consumed}</span>
                <span className="semi-gauge__unit">kcal</span>
            </div>
            <div className="semi-gauge__footer">
                <div className="semi-gauge__stat">
                    <span className="semi-gauge__stat-value">{consumed}</span>
                    <span className="semi-gauge__stat-label">Consommé</span>
                </div>
                <div className="semi-gauge__divider" />
                <div className="semi-gauge__stat">
                    <span className="semi-gauge__stat-value">{remaining}</span>
                    <span className="semi-gauge__stat-label">Restant</span>
                </div>
            </div>
        </div>
    );
}

const MACROS = [
    { label: "Protéines", value: CONSUMED.proteins, goal: DAILY_GOAL.proteins, color: "#0d9488", icon: Drumstick },
    { label: "Glucides", value: CONSUMED.carbs, goal: DAILY_GOAL.carbs, color: "#f97316", icon: Wheat },
    { label: "Lipides", value: CONSUMED.lipids, goal: DAILY_GOAL.lipids, color: "#8b5cf6", icon: Droplet },
];

export default function TrackingDesignC() {
    const [openMeals, setOpenMeals] = useState<number[]>([1]);

    const toggleMeal = (id: number) => {
        setOpenMeals((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        );
    };

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

                {/* Hero Summary Card */}
                <section className="hero-summary-card">
                    <SemiCircleGauge consumed={CONSUMED.calories} goal={DAILY_GOAL.calories} />

                    <div className="macro-pills">
                        {MACROS.map((m) => {
                            const pct = Math.min((m.value / m.goal) * 100, 100);
                            return (
                                <div key={m.label} className="macro-pill">
                                    <div className="macro-pill__header">
                                        <m.icon size={12} style={{ color: m.color }} />
                                        <span className="macro-pill__label">{m.label}</span>
                                    </div>
                                    <div className="macro-pill__bar">
                                        <div className="macro-pill__fill" style={{ width: `${pct}%`, background: m.color }} />
                                    </div>
                                    <span className="macro-pill__value">{m.value}/{m.goal}g</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Meal Accordions */}
                <section className="tracking-meals">
                    {MEALS.map((meal) => {
                        const mealCal = meal.items.reduce((s, i) => s + i.calories, 0);
                        const isOpen = openMeals.includes(meal.id);
                        return (
                            <div key={meal.id} className={`meal-accordion ${isOpen ? "open" : ""}`}>
                                <button className="meal-accordion__header" onClick={() => toggleMeal(meal.id)}>
                                    <div className="meal-card__left">
                                        <div className="meal-card__icon">
                                            <meal.icon size={18} />
                                        </div>
                                        <div className="meal-accordion__info">
                                            <span className="meal-card__slot">{meal.slot}</span>
                                            <span className="meal-accordion__count">{meal.items.length} aliment{meal.items.length > 1 ? "s" : ""}</span>
                                        </div>
                                    </div>
                                    <div className="meal-accordion__right">
                                        <span className="meal-card__cal">{mealCal} kcal</span>
                                        <ChevronDown size={16} className={`meal-accordion__chevron ${isOpen ? "rotated" : ""}`} />
                                    </div>
                                </button>
                                {isOpen && (
                                    <div className="meal-accordion__body">
                                        {meal.items.map((item, i) => (
                                            <div key={i} className="meal-accordion__item">
                                                <div className="meal-accordion__item-info">
                                                    <span className="meal-item__name">{item.name}</span>
                                                    <span className="food-log__macros">
                                                        P: {item.proteins}g · G: {item.carbs}g · L: {item.lipids}g
                                                    </span>
                                                </div>
                                                <span className="meal-item__cal">{item.calories} kcal</span>
                                            </div>
                                        ))}
                                        <button className="meal-add-btn">
                                            <Plus size={14} /> Ajouter un aliment
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </section>

                {/* Sticky Bottom Summary */}
                <div className="sticky-macro-bar">
                    {MACROS.map((m) => (
                        <div key={m.label} className="sticky-macro-bar__item">
                            <div className="sticky-macro-bar__dot" style={{ background: m.color }} />
                            <span>{m.value}g</span>
                        </div>
                    ))}
                    <div className="sticky-macro-bar__item sticky-macro-bar__item--cal">
                        <span>🔥 {CONSUMED.calories}</span>
                    </div>
                </div>
            </div>
        </>
    );
}

