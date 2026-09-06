"use client"

import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, CalendarCheck, Target, Flame } from "lucide-react";
import Link from "next/link";
import { MonthlyStats } from "@/types/tracking.types";
import { getMonthlyStats } from "@/api/services/foodlog.service";
import { useAuth } from "@/hooks/useAuth";

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const monthLabel = (key: string) => {
    const [year, month] = key.split("-").map(Number);
    return new Date(year, month - 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
};

export default function StatsPage() {
    const { isAuthenticated } = useAuth();
    const [month, setMonth] = useState(monthKey(new Date()));
    const [stats, setStats] = useState<MonthlyStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) return;
        let active = true;
        setLoading(true);
        getMonthlyStats(month)
            .then((res) => {
                if (active) setStats(res.data ?? null);
            })
            .catch(() => {
                if (active) setStats(null);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [isAuthenticated, month]);

    const shiftMonth = (delta: number) => {
        const [year, m] = month.split("-").map(Number);
        setMonth(monthKey(new Date(year, m - 1 + delta)));
    };

    const isCurrentMonth = month === monthKey(new Date());

    const macros = stats
        ? [
            { label: "Calories", value: stats.average.calories, unit: "kcal", goal: stats.goals?.calories },
            { label: "Protéines", value: stats.average.proteins, unit: "g", goal: stats.goals?.proteins },
            { label: "Glucides", value: stats.average.carbs, unit: "g", goal: stats.goals?.carbs },
            { label: "Lipides", value: stats.average.lipids, unit: "g", goal: stats.goals?.lipids },
        ]
        : [];

    return (
        <div className="informations-page">
            <div className="bg-gradient-decor"></div>

            <header className="informations-header">
                <Link className="circle-btn" href="/tracking">
                    <ArrowLeft />
                </Link>
                <h1 className="informations-title">Bilan du mois</h1>
            </header>

            <main className="informations-content">
                <div className="stats-month-nav">
                    <button className="stats-month-nav__arrow" onClick={() => shiftMonth(-1)} aria-label="Mois précédent">
                        <ChevronLeft size={18} />
                    </button>
                    <span className="stats-month-nav__label">{monthLabel(month)}</span>
                    <button
                        className="stats-month-nav__arrow"
                        onClick={() => shiftMonth(1)}
                        disabled={isCurrentMonth}
                        aria-label="Mois suivant"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {loading ? (
                    <p className="weight-chart__empty">Chargement…</p>
                ) : !stats || stats.days_logged === 0 ? (
                    <div className="info-card" style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
                        <p className="weight-chart__empty">Aucune donnée pour ce mois.</p>
                    </div>
                ) : (
                    <>
                        <div className="stats-highlights">
                            <div className="stat-highlight">
                                <div className="stat-highlight__icon teal">
                                    <CalendarCheck size={20} />
                                </div>
                                <span className="stat-highlight__value">{stats.days_logged}</span>
                                <span className="stat-highlight__label">jours suivis</span>
                            </div>
                            <div className="stat-highlight">
                                <div className="stat-highlight__icon orange">
                                    <Target size={20} />
                                </div>
                                <span className="stat-highlight__value">
                                    {stats.days_on_target ?? "–"}
                                </span>
                                <span className="stat-highlight__label">jours dans l&apos;objectif</span>
                            </div>
                        </div>

                        <div className="info-card" style={{ padding: "1.25rem" }}>
                            <h2 className="weight-form-title">
                                <Flame size={16} /> Moyennes journalières
                            </h2>
                            <div className="stats-averages">
                                {macros.map((m) => (
                                    <div key={m.label} className="stats-average">
                                        <span className="stats-average__label">{m.label}</span>
                                        <div className="stats-average__values">
                                            <span className="stats-average__value">
                                                {m.value} {m.unit}
                                            </span>
                                            {m.goal != null && (
                                                <span className="stats-average__goal">/ {m.goal}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
