"use client"

import { ArrowLeft, ArrowRight, Check, Mars, Venus, Armchair, Footprints, Bike, Dumbbell, Flame, Target, Sparkles, Calculator, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { ActivityLevel, Gender, CalorieObjective, applyObjective } from "@/utils/tdee.utils";
import { useCalorieOnboarding, TOTAL_STEPS, OnboardingData } from "@/hooks/useCalorieOnboarding";
import { useCalorieGoal, CalorieGoal } from "@/hooks/useCalorieGoal";

const GENDERS: { value: Gender; label: string; icon: typeof Mars }[] = [
    { value: "male", label: "Homme", icon: Mars },
    { value: "female", label: "Femme", icon: Venus },
];

const ACTIVITIES: { value: ActivityLevel; label: string; desc: string; icon: typeof Armchair }[] = [
    { value: "sedentary", label: "Sédentaire", desc: "Travail de bureau", icon: Armchair },
    { value: "light", label: "Exercice léger", desc: "1-2 jours / semaine", icon: Footprints },
    { value: "moderate", label: "Exercice modéré", desc: "3-5 jours / semaine", icon: Bike },
    { value: "heavy", label: "Exercice intense", desc: "6-7 jours / semaine", icon: Dumbbell },
    { value: "athlete", label: "Athlète", desc: "2x par jour", icon: Flame },
];

const STEP_TITLES = [
    "Quel est ton genre ?",
    "Quel est ton âge ?",
    "Quel est ton poids ?",
    "Quelle est ta taille ?",
    "Ton niveau d'activité ?",
];

const OBJECTIVES: { value: CalorieObjective; label: string; desc: string; icon: typeof Minus }[] = [
    { value: "maintain", label: "Maintien", desc: "Rester à ton poids actuel", icon: Minus },
    { value: "cut_moderate", label: "Sèche modérée", desc: "Perte de poids progressive (-15%)", icon: TrendingDown },
    { value: "cut_intense", label: "Sèche intensive", desc: "Perte de poids accélérée (-25%)", icon: TrendingDown },
    { value: "bulk_moderate", label: "Prise de masse modérée", desc: "Gain de muscle propre (+10%)", icon: TrendingUp },
    { value: "bulk_intense", label: "Prise de masse intensive", desc: "Gain de masse accéléré (+20%)", icon: TrendingUp },
];

export default function CalorieOnboarding() {
    const { goal, loading, saveGoal } = useCalorieGoal();

    if (loading) return <Loader />;

    return <OnboardingWizard goal={goal} saveGoal={saveGoal} />;
}

const goalToOnboardingData = (goal: CalorieGoal): Partial<OnboardingData> => ({
    gender: goal.gender as Gender,
    age: String(goal.age),
    weight: String(goal.weight),
    height: String(goal.height),
    activity: goal.activity,
});

interface WizardProps {
    goal: CalorieGoal | null;
    saveGoal: (goal: CalorieGoal) => Promise<void>;
}

function OnboardingWizard({ goal, saveGoal }: WizardProps) {
    const router = useRouter();
    const editMode = goal !== null;
    const [started, setStarted] = useState(editMode);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [postPhase, setPostPhase] = useState<"result" | "objective">("result");
    const [objective, setObjective] = useState<CalorieObjective>(goal?.objective ?? "maintain");
    const { step, data, result, isStepValid, update, next, back, reset, progress } =
        useCalorieOnboarding(goal ? goalToOnboardingData(goal) : undefined);

    const finalResult = useMemo(
        () => (result ? applyObjective(result, objective) : null),
        [result, objective]
    );

    const restart = () => {
        setPostPhase("result");
        setObjective("maintain");
        reset();
    };

    const handleConfirm = async () => {
        if (!finalResult || !data.gender || !data.activity) return;
        setSaving(true);
        setSaveError(null);
        try {
            await saveGoal({
                ...finalResult,
                gender: data.gender,
                age: Number(data.age),
                weight: Number(data.weight),
                height: Number(data.height),
                activity: data.activity,
                objective,
            });
            router.push("/tracking");
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : "Une erreur est survenue.");
        } finally {
            setSaving(false);
        }
    };

    if (!started && !result) {
        return (
            <>
                <div className="bg-gradient-decor"></div>
                <div className="onboarding-page onboarding-page--intro">
                    <div className="onboarding-intro">
                        <div className="onboarding-intro__badge">
                            <Target size={32} />
                        </div>

                        <h1 className="onboarding-intro__title">
                            Trouve ton objectif calorique
                        </h1>
                        <p className="onboarding-intro__text">
                            Le but de cette page est de déterminer le nombre de calories dont
                            ton corps a besoin chaque jour. En quelques questions, on calcule
                            ton objectif quotidien et la répartition idéale de tes macros.
                        </p>

                        <ul className="onboarding-intro__list">
                            <li className="onboarding-intro__item">
                                <span className="onboarding-intro__item-icon"><Calculator size={18} /></span>
                                <span>Un calcul basé sur ton profil (âge, poids, taille, activité)</span>
                            </li>
                            <li className="onboarding-intro__item">
                                <span className="onboarding-intro__item-icon"><Sparkles size={18} /></span>
                                <span>Un objectif personnalisé de calories et de macros</span>
                            </li>
                            <li className="onboarding-intro__item">
                                <span className="onboarding-intro__item-icon"><Flame size={18} /></span>
                                <span>Ton suivi quotidien adapté à tes besoins</span>
                            </li>
                        </ul>
                    </div>

                    <div className="onboarding-actions">
                        <button className="btn-primary" onClick={() => setStarted(true)}>
                            Commencer
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </>
        );
    }

    if (result) {
        const displayed = postPhase === "objective" ? finalResult! : result;
        const macros = [
            { label: "Protéines", value: displayed.proteins, color: "#0d9488" },
            { label: "Glucides", value: displayed.carbs, color: "#f97316" },
            { label: "Lipides", value: displayed.lipids, color: "#8b5cf6" },
        ];

        if (postPhase === "result") {
            return (
                <>
                    <div className="bg-gradient-decor"></div>
                    <div className="onboarding-page">
                        <header className="onboarding-header">
                            <h1 className="onboarding-title">Ton maintien</h1>
                        </header>

                        <div className="onboarding-result">
                            <div className="onboarding-result__badge">
                                <Flame size={22} />
                            </div>
                            <p className="onboarding-result__value">{result.calories}</p>
                            <p className="onboarding-result__unit">calories / jour</p>
                        </div>

                        <div className="onboarding-macros">
                            {macros.map((m) => (
                                <div key={m.label} className="onboarding-macros__item">
                                    <span className="onboarding-macros__dot" style={{ background: m.color }} />
                                    <span className="onboarding-macros__label">{m.label}</span>
                                    <span className="onboarding-macros__value">{m.value} g</span>
                                </div>
                            ))}
                        </div>

                        <div className="onboarding-actions onboarding-actions--single">
                            <button className="btn-primary" onClick={() => setPostPhase("objective")}>
                                Continuer
                                <ArrowRight size={18} />
                            </button>
                            <button className="onboarding-restart" onClick={restart} disabled={saving}>
                                Recommencer
                            </button>
                        </div>
                    </div>
                </>
            );
        }

        const delta = finalResult!.calories - result.calories;
        return (
            <>
                <div className="bg-gradient-decor"></div>
                <div className="onboarding-page">
                    <header className="onboarding-header">
                        <button className="circle-btn" onClick={() => setPostPhase("result")}>
                            <ArrowLeft />
                        </button>
                        <h1 className="onboarding-title">Ton objectif</h1>
                    </header>

                    <h2 className="onboarding-question">Que veux-tu faire ?</h2>

                    <div className="onboarding-options">
                        {OBJECTIVES.map((o) => (
                            <button
                                key={o.value}
                                className={`option-row ${objective === o.value ? "selected" : ""}`}
                                onClick={() => setObjective(o.value)}
                            >
                                <div className="option-row__icon">
                                    <o.icon size={20} />
                                </div>
                                <div className="option-row__text">
                                    <span className="option-row__label">{o.label}</span>
                                    <span className="option-row__desc">{o.desc}</span>
                                </div>
                                {objective === o.value && (
                                    <Check size={18} className="option-row__check" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="onboarding-result onboarding-result--compact">
                        <p className="onboarding-result__value">{finalResult!.calories}</p>
                        <p className="onboarding-result__unit">
                            calories / jour
                            {delta !== 0 && (
                                <span className="onboarding-result__delta">
                                    {" "}({delta > 0 ? "+" : ""}{delta} kcal)
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="onboarding-macros">
                        {macros.map((m) => (
                            <div key={m.label} className="onboarding-macros__item">
                                <span className="onboarding-macros__dot" style={{ background: m.color }} />
                                <span className="onboarding-macros__label">{m.label}</span>
                                <span className="onboarding-macros__value">{m.value} g</span>
                            </div>
                        ))}
                    </div>

                    <div className="onboarding-actions onboarding-actions--single">
                        <button className="btn-primary" onClick={handleConfirm} disabled={saving}>
                            {saving ? (
                                "Enregistrement..."
                            ) : (
                                <><Check size={18} /> Utiliser cet objectif</>
                            )}
                        </button>
                        {saveError && <p className="error-message">{saveError}</p>}
                        <button className="onboarding-restart" onClick={restart} disabled={saving}>
                            Recommencer
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="bg-gradient-decor"></div>
            <div className="onboarding-page">
                <header className="onboarding-header">
                    {step === 0 ? (
                        <button
                            className="circle-btn"
                            onClick={() => (editMode ? router.push("/tracking") : setStarted(false))}
                        >
                            <ArrowLeft />
                        </button>
                    ) : (
                        <button className="circle-btn" onClick={back}>
                            <ArrowLeft />
                        </button>
                    )}
                    <span className="onboarding-step-count">
                        Étape {step + 1} / {TOTAL_STEPS}
                    </span>
                </header>

                <div className="onboarding-progress">
                    <div className="onboarding-progress__fill" style={{ width: `${progress}%` }} />
                </div>

                <h2 className="onboarding-question">{STEP_TITLES[step]}</h2>

                <main className="onboarding-content">
                    {step === 0 && (
                        <div className="onboarding-options onboarding-options--grid">
                            {GENDERS.map((g) => (
                                <button
                                    key={g.value}
                                    className={`option-card ${data.gender === g.value ? "selected" : ""}`}
                                    onClick={() => update("gender", g.value)}
                                >
                                    <g.icon size={28} />
                                    <span className="option-card__label">{g.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="onboarding-number">
                            <input
                                type="number"
                                inputMode="numeric"
                                className="onboarding-number__input"
                                value={data.age}
                                onChange={(e) => update("age", e.target.value)}
                                placeholder="30"
                                autoFocus
                            />
                            <span className="onboarding-number__unit">ans</span>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="onboarding-number">
                            <input
                                type="number"
                                inputMode="decimal"
                                className="onboarding-number__input"
                                value={data.weight}
                                onChange={(e) => update("weight", e.target.value)}
                                placeholder="70"
                                autoFocus
                            />
                            <span className="onboarding-number__unit">kg</span>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="onboarding-number">
                            <input
                                type="number"
                                inputMode="numeric"
                                className="onboarding-number__input"
                                value={data.height}
                                onChange={(e) => update("height", e.target.value)}
                                placeholder="175"
                                autoFocus
                            />
                            <span className="onboarding-number__unit">cm</span>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="onboarding-options">
                            {ACTIVITIES.map((a) => (
                                <button
                                    key={a.value}
                                    className={`option-row ${data.activity === a.value ? "selected" : ""}`}
                                    onClick={() => update("activity", a.value)}
                                >
                                    <div className="option-row__icon">
                                        <a.icon size={20} />
                                    </div>
                                    <div className="option-row__text">
                                        <span className="option-row__label">{a.label}</span>
                                        <span className="option-row__desc">{a.desc}</span>
                                    </div>
                                    {data.activity === a.value && (
                                        <Check size={18} className="option-row__check" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </main>

                <div className="onboarding-actions">
                    <button className="btn-primary" onClick={next} disabled={!isStepValid}>
                        {step === TOTAL_STEPS - 1 ? "Calculer" : "Suivant"}
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </>
    );
}
