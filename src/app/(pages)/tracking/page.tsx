"use client"

import { Trash2, Pencil } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/Loader";
import MealAddForm from "@/components/tracking/MealAddForm";
import { useTracking } from "@/hooks/useTracking";
import { useCalorieGoal } from "@/hooks/useCalorieGoal";

const MACROS_CONFIG = [
    { key: "proteins" as const, label: "Protéines", color: "#0d9488" },
    { key: "carbs" as const, label: "Glucides", color: "#f97316" },
    { key: "lipids" as const, label: "Lipides", color: "#8b5cf6" },
];

export default function Tracking() {
    const router = useRouter();
    const { goal, hasGoal, loading } = useCalorieGoal();

    const {
        dailyGoal,
        consumed,
        meals,
        weekDays,
        weekConsumed,
        selectedDay,
        selectedWeekDay,
        setSelectedDay,
        expandedMeal,
        toggleMeal,
        hasData,
        addItem,
        removeItem,
    } = useTracking(goal);

    useEffect(() => {
        if (!loading && !hasGoal) {
            router.replace("/tracking/onboarding");
        }
    }, [loading, hasGoal, router]);

    if (loading || !hasGoal) return <Loader />;

    const remainingCalories = dailyGoal.calories - consumed.calories;
    const caloriePct = Math.min((consumed.calories / dailyGoal.calories) * 100, 100);

    return (
        <>
            <div className="bg-gradient-decor"></div>
            <div className="tracking-page">
                <header className="tracking-header tracking-header--row">
                    <div>
                        <h1 className="tracking-title">Suivi du jour</h1>
                        <p className="tracking-date">
                            {selectedWeekDay?.fullDate ??
                                new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                        </p>
                    </div>
                    <Link className="circle-btn" href="/tracking/onboarding?edit=1" aria-label="Modifier mes données">
                        <Pencil />
                    </Link>
                </header>

                <section className="day-picker">
                    {weekDays.map((day, i) => {
                        const dayConsumed = weekConsumed[day.iso];
                        const hasLog = (dayConsumed?.calories ?? 0) > 0;
                        return (
                            <button
                                key={i}
                                className={`day-picker__btn ${selectedDay === i ? "active" : ""} ${day.isFuture ? "future" : ""}`}
                                onClick={() => setSelectedDay(i)}
                            >
                                <span className="day-picker__label">{day.label}</span>
                                <span className="day-picker__date">{day.date}</span>
                                <span className={`day-picker__dot ${hasLog ? "filled" : ""}`} />
                            </button>
                        );
                    })}
                </section>

                {/* Calories Card */}
                <section className="calories-card">
                    <span className="calories-card__label">Calories</span>
                    <div className="calories-card__row">
                        <p className="calories-card__consumed">
                            <span className="calories-card__value">{consumed.calories} cal</span>
                            <span className="calories-card__goal"> / {dailyGoal.calories}</span>
                        </p>
                        <p className="calories-card__remaining">
                            {remainingCalories} <span className="calories-card__remaining-label">restants</span>
                        </p>
                    </div>
                    <div className="calories-card__track">
                        <div
                            className="calories-card__fill"
                            style={{ width: `${caloriePct}%` }}
                        />
                    </div>
                </section>

                <section className="macros-card">
                    {MACROS_CONFIG.map((m) => {
                        const value = consumed[m.key];
                        const target = dailyGoal[m.key];
                        const pct = Math.min((value / target) * 100, 100);
                        return (
                            <div key={m.key} className="macros-card__item">
                                <span className="macros-card__label">{m.label}</span>
                                <p className="macros-card__values">
                                    <span className="macros-card__value">{value} g</span>
                                    <span className="macros-card__goal"> / {target}</span>
                                </p>
                                <div className="macros-card__track">
                                    <div
                                        className="macros-card__fill"
                                        style={{ width: `${pct}%`, background: m.color }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </section>

                <section className="tracking-meals">
                    <h2 className="tracking-section-title">
                        {selectedWeekDay?.isToday ? "Repas du jour" : "Historique"}
                    </h2>

                    {!hasData && !selectedWeekDay?.isToday ? (
                        <div className="tracking-empty">
                            <p className="tracking-empty__title">
                                {selectedWeekDay?.isFuture ? "Journée à venir" : "Aucun repas enregistré"}
                            </p>
                            <p className="tracking-empty__text">
                                {selectedWeekDay?.isFuture
                                    ? "Tu pourras enregistrer tes repas le jour venu."
                                    : "Aucun aliment n'a été ajouté ce jour-là."}
                            </p>
                        </div>
                    ) : (
                        meals.map((meal) => {
                            const mealCal = meal.items.reduce((s, i) => s + i.calories, 0);
                            const isOpen = expandedMeal === meal.slot;
                            return (
                                <div key={meal.slot} className="meal-card">
                                    <button className="meal-card__header" onClick={() => toggleMeal(meal.slot)}>
                                        <div className="meal-card__left">
                                            <div className="meal-card__icon">
                                                <meal.icon size={18} />
                                            </div>
                                            <span className="meal-card__slot">{meal.label}</span>
                                        </div>
                                        <span className="meal-card__cal">{mealCal} kcal</span>
                                    </button>
                                    {isOpen && (
                                        <div className="meal-card__items">
                                            {meal.items.length === 0 ? (
                                                <p className="meal-card__empty">Aucun aliment</p>
                                            ) : (
                                                meal.items.map((item) => (
                                                    <div key={item.id} className="meal-item">
                                                        <span className="meal-item__name">{item.name}</span>
                                                        <div className="meal-item__right">
                                                            <span className="meal-item__cal">{item.calories} kcal</span>
                                                            {selectedWeekDay?.isToday && (
                                                                <button
                                                                    className="meal-item__delete"
                                                                    onClick={() => removeItem(item.id)}
                                                                    aria-label="Supprimer"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                            {selectedWeekDay?.isToday && (
                                                <MealAddForm slot={meal.slot} onAdd={addItem} />
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </section>
            </div>
        </>
    );
}
