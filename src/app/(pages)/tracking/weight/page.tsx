"use client"

import { useState } from "react";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import WeightChart from "@/components/tracking/WeightChart";
import { useWeight } from "@/hooks/useWeight";
import { toISODate } from "@/utils/format.utils";

const RANGES = [
    { label: "3 mois", months: 3 },
    { label: "6 mois", months: 6 },
    { label: "1 an", months: 12 },
];

export default function WeightPage() {
    const [months, setMonths] = useState(3);
    const { entries, loading, error, saveWeight, removeWeight } = useWeight(months);
    const [weight, setWeight] = useState("");
    const [date, setDate] = useState(toISODate(new Date()));

    const handleAdd = async () => {
        const value = Number(weight);
        if (!value || value <= 0) return;
        await saveWeight(value, date);
        setWeight("");
    };

    const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="informations-page">
            <div className="bg-gradient-decor"></div>

            <header className="informations-header">
                <Link className="circle-btn" href="/tracking">
                    <ArrowLeft />
                </Link>
                <h1 className="informations-title">Suivi du poids</h1>
            </header>

            <main className="informations-content">
                <div className="info-card" style={{ padding: "1.25rem" }}>
                    <div className="weight-ranges">
                        {RANGES.map((r) => (
                            <button
                                key={r.months}
                                className={`weight-range ${months === r.months ? "active" : ""}`}
                                onClick={() => setMonths(r.months)}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <p className="weight-chart__empty">Chargement…</p>
                    ) : (
                        <WeightChart entries={entries} />
                    )}
                </div>

                <div className="info-card" style={{ padding: "1.25rem" }}>
                    <h2 className="weight-form-title">Ajouter une mesure</h2>
                    <div className="weight-form">
                        <input
                            className="weight-form__input"
                            type="number"
                            placeholder="Poids (kg)"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                        <input
                            className="weight-form__input"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <button className="weight-form__add" onClick={handleAdd} aria-label="Ajouter">
                            <Plus size={18} />
                        </button>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                </div>

                {sorted.length > 0 && (
                    <div className="info-card" style={{ padding: "1.25rem" }}>
                        <h2 className="weight-form-title">Historique</h2>
                        <ul className="weight-list">
                            {sorted.map((entry) => (
                                <li key={entry.id} className="weight-list__item">
                                    <span className="weight-list__weight">{entry.weight} kg</span>
                                    <span className="weight-list__date">
                                        {new Date(entry.date).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                    <button
                                        className="weight-list__delete"
                                        onClick={() => removeWeight(entry.id)}
                                        aria-label="Supprimer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
}
