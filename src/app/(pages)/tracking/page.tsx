"use client"

import { Trash2, Pencil, ChevronLeft, ChevronRight, LineChart, BarChart3, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/Loader";
import PageHeader from "@/components/ui/PageHeader";
import RecipeQuickAdd from "@/components/tracking/RecipeQuickAdd";
import { useTracking } from "@/hooks/useTracking";
import { useCalorieGoal } from "@/hooks/useCalorieGoal";
import { useRecipes } from "@/hooks/useRecipes";
import { MealSlot } from "@/types/tracking.types";

const MACROS_CONFIG = [
    { key: "proteins" as const, label: "Protéines", color: "#0d9488" },
    { key: "carbs" as const, label: "Glucides", color: "#f97316" },
    { key: "lipids" as const, label: "Lipides", color: "#8b5cf6" },
];

export default function Tracking() {
    const router = useRouter();
    const { goal, hasGoal, loading } = useCalorieGoal();
    const { recipes, recipeTypes } = useRecipes();

    const {
        dailyGoal,
        consumed,
        remaining,
        meals,
        weekDays,
        weekConsumed,
        weekOffset,
        goToWeek,
        goToToday,
        selectedDay,
        selectedWeekDay,
        setSelectedDay,
        expandedMeal,
        toggleMeal,
        hasData,
        addItem,
        removeItem,
    } = useTracking(goal);

    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [addSlot, setAddSlot] = useState<MealSlot | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 50) goToWeek(delta < 0 ? 1 : -1);
        setTouchStartX(null);
    };

    useEffect(() => {
        if (!loading && !hasGoal) {
            router.replace("/tracking/onboarding");
        }
    }, [loading, hasGoal, router]);

    if (loading || !hasGoal) return <Loader />;

    const remainingCalories = remaining?.calories ?? Math.max(dailyGoal.calories - consumed.calories, 0);
    const caloriePct = Math.min((consumed.calories / dailyGoal.calories) * 100, 100);

    const firstDay = weekDays[0];
    const lastDay = weekDays[weekDays.length - 1];
    const weekRangeLabel = firstDay && lastDay
        ? `${firstDay.date} – ${new Date(lastDay.iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`
        : "";

    return (
        <>
            <div className="bg-gradient-decor"></div>
            <div className="page-shell tracking-page">
                <PageHeader
                    title="Suivi du jour"
                    subtitle={
                        selectedWeekDay?.fullDate ??
                        new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
                    }
                    leading={
                        <div className="header-actions">
                            <Link className="circle-btn circle-btn--teal" href="/tracking/weight" aria-label="Suivi du poids">
                                <LineChart />
                            </Link>
                            <Link className="circle-btn circle-btn--orange" href="/tracking/stats" aria-label="Bilan du mois">
                                <BarChart3 />
                            </Link>
                        </div>
                    }
                    action={
                        <Link className="circle-btn" href="/tracking/onboarding?edit=1" aria-label="Modifier mes données">
                            <Pencil />
                        </Link>
                    }
                />

                <div className="tracking-body">
                <div className="week-nav">
                    <button className="week-nav__arrow" onClick={() => goToWeek(-1)} aria-label="Semaine précédente">
                        <ChevronLeft size={18} />
                    </button>
                    <div className="week-nav__center">
                        <span className="week-nav__label">{weekRangeLabel}</span>
                        {weekOffset !== 0 && (
                            <button className="week-nav__today" onClick={goToToday}>Aujourd&apos;hui</button>
                        )}
                    </div>
                    <button className="week-nav__arrow" onClick={() => goToWeek(1)} aria-label="Semaine suivante">
                        <ChevronRight size={18} />
                    </button>
                </div>
                <section
                    className="day-picker"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
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
                                                <button className="meal-add-btn" onClick={() => setAddSlot(meal.slot)}>
                                                    <Plus size={16} /> Ajouter une recette
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </section>
                </div>
            </div>

            {addSlot && (
                <RecipeQuickAdd
                    slot={addSlot}
                    recipes={recipes}
                    recipeTypes={recipeTypes}
                    onAdd={addItem}
                    open={true}
                    onClose={() => setAddSlot(null)}
                />
            )}
        </>
    );
}
