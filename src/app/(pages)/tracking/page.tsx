"use client"

import { Drumstick, Wheat, Droplet, Plus } from "lucide-react";
import CalorieRing from "@/components/tracking/CalorieRing";
import MacroBar from "@/components/tracking/MacroBar";
import { useTracking } from "@/hooks/useTracking";

export default function Tracking() {
    const {
        dailyGoal,
        consumed,
        meals,
        weekDays,
        selectedDay,
        setSelectedDay,
        expandedMeal,
        toggleMeal,
    } = useTracking();

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
                    <CalorieRing consumed={consumed.calories} goal={dailyGoal.calories} />
                </section>

                <section className="tracking-macros-card">
                    <MacroBar label="Protéines" value={consumed.proteins} goal={dailyGoal.proteins} color="#0d9488" icon={Drumstick} />
                    <MacroBar label="Glucides" value={consumed.carbs} goal={dailyGoal.carbs} color="#f97316" icon={Wheat} />
                    <MacroBar label="Lipides" value={consumed.lipids} goal={dailyGoal.lipids} color="#8b5cf6" icon={Droplet} />
                </section>

                <section className="tracking-meals">
                    <h2 className="tracking-section-title">Repas</h2>
                    {meals.map((meal) => {
                        const mealCal = meal.items.reduce((s, i) => s + i.calories, 0);
                        const isOpen = expandedMeal === meal.id;
                        return (
                            <div key={meal.id} className="meal-card">
                                <button className="meal-card__header" onClick={() => toggleMeal(meal.id)}>
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
