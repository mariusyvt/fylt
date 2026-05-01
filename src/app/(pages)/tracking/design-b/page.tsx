"use client"

import { Flame, Drumstick, Wheat, Droplet } from "lucide-react";
import { useState } from "react";

// ── Fake data ──
const DAILY_GOAL = { calories: 2200, proteins: 150, carbs: 280, lipids: 75 };
const CONSUMED = { calories: 1450, proteins: 95, carbs: 180, lipids: 42 };

const WEEK_DAYS = [
    { label: "L", date: 28 },
    { label: "M", date: 29 },
    { label: "M", date: 30 },
    { label: "J", date: 1, today: true },
    { label: "V", date: 2 },
    { label: "S", date: 3 },
    { label: "D", date: 4 },
];

const FOOD_LOG = [
    { time: "Matin", items: [
        { name: "Porridge protéiné", calories: 350, proteins: 25, carbs: 45, lipids: 8 },
        { name: "Banane", calories: 90, proteins: 1, carbs: 23, lipids: 0 },
    ]},
    { time: "Midi", items: [
        { name: "Poulet grillé & riz", calories: 520, proteins: 42, carbs: 55, lipids: 12 },
        { name: "Salade verte", calories: 45, proteins: 2, carbs: 8, lipids: 1 },
    ]},
    { time: "Soir", items: [
        { name: "Yaourt grec", calories: 120, proteins: 12, carbs: 8, lipids: 5 },
        { name: "Saumon & légumes", calories: 325, proteins: 13, carbs: 41, lipids: 16 },
    ]},
];

const STATS = [
    { label: "Calories", value: CONSUMED.calories, goal: DAILY_GOAL.calories, unit: "kcal", color: "#0d9488", icon: Flame },
    { label: "Protéines", value: CONSUMED.proteins, goal: DAILY_GOAL.proteins, unit: "g", color: "#3b82f6", icon: Drumstick },
    { label: "Glucides", value: CONSUMED.carbs, goal: DAILY_GOAL.carbs, unit: "g", color: "#f97316", icon: Wheat },
    { label: "Lipides", value: CONSUMED.lipids, goal: DAILY_GOAL.lipids, unit: "g", color: "#8b5cf6", icon: Droplet },
];

function MiniRing({ pct, color, size = 36 }: { pct: number; color: string; size?: number }) {
    const r = (size - 6) / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - Math.min(pct, 1));
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="3" />
            <circle
                cx={size/2} cy={size/2} r={r} fill="none"
                stroke={color} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset}
                transform={`rotate(-90 ${size/2} ${size/2})`}
            />
        </svg>
    );
}

export default function TrackingDesignB() {
    const [selectedDay, setSelectedDay] = useState(3);

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

                {/* Stat Cards Grid */}
                <section className="stat-grid">
                    {STATS.map((stat) => {
                        const pct = stat.value / stat.goal;
                        const remaining = stat.goal - stat.value;
                        return (
                            <div key={stat.label} className="stat-card" style={{ borderLeftColor: stat.color }}>
                                <div className="stat-card__top">
                                    <div>
                                        <span className="stat-card__value">{stat.value}</span>
                                        <span className="stat-card__unit"> {stat.unit}</span>
                                    </div>
                                    <MiniRing pct={pct} color={stat.color} />
                                </div>
                                <span className="stat-card__label">{stat.label}</span>
                                <span className="stat-card__remaining">Reste {remaining} {stat.unit}</span>
                            </div>
                        );
                    })}
                </section>

                {/* Week Day Picker */}
                <section className="day-picker">
                    {WEEK_DAYS.map((day, i) => (
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

                {/* Food Log */}
                <section className="food-log">
                    {FOOD_LOG.map((group) => (
                        <div key={group.time} className="food-log__group">
                            <h3 className="food-log__time">{group.time}</h3>
                            {group.items.map((item, i) => (
                                <div key={i} className="food-log__item">
                                    <div className="food-log__info">
                                        <span className="food-log__name">{item.name}</span>
                                        <span className="food-log__macros">
                                            P: {item.proteins}g · G: {item.carbs}g · L: {item.lipids}g
                                        </span>
                                    </div>
                                    <span className="food-log__cal">{item.calories} kcal</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </section>
            </div>
        </>
    );
}

