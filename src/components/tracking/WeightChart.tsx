"use client";

import { useMemo } from "react";
import { WeightEntry } from "@/types/tracking.types";

interface WeightChartProps {
    entries: WeightEntry[];
}

const WIDTH = 320;
const HEIGHT = 160;
const PADDING = { top: 16, right: 12, bottom: 24, left: 32 };

export default function WeightChart({ entries }: WeightChartProps) {
    const sorted = useMemo(
        () => [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        [entries]
    );

    if (sorted.length < 2) {
        return <p className="weight-chart__empty">Ajoutez au moins 2 mesures pour afficher la courbe.</p>;
    }

    const weights = sorted.map((e) => e.weight);
    const minW = Math.min(...weights);
    const maxW = Math.max(...weights);
    const range = maxW - minW || 1;

    const innerW = WIDTH - PADDING.left - PADDING.right;
    const innerH = HEIGHT - PADDING.top - PADDING.bottom;

    const points = sorted.map((e, i) => {
        const x = PADDING.left + (i / (sorted.length - 1)) * innerW;
        const y = PADDING.top + (1 - (e.weight - minW) / range) * innerH;
        return { x, y, entry: e };
    });

    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPath =
        `${linePath} L ${points[points.length - 1].x} ${PADDING.top + innerH} ` +
        `L ${points[0].x} ${PADDING.top + innerH} Z`;

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

    return (
        <svg className="weight-chart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                </linearGradient>
            </defs>

            <text x={PADDING.left - 6} y={PADDING.top + 4} className="weight-chart__axis" textAnchor="end">
                {maxW}
            </text>
            <text x={PADDING.left - 6} y={PADDING.top + innerH} className="weight-chart__axis" textAnchor="end">
                {minW}
            </text>

            <path d={areaPath} fill="url(#weightGradient)" />
            <path d={linePath} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#ffffff" stroke="#0d9488" strokeWidth="2" />
            ))}

            <text x={points[0].x} y={HEIGHT - 6} className="weight-chart__axis" textAnchor="start">
                {formatDate(sorted[0].date)}
            </text>
            <text x={points[points.length - 1].x} y={HEIGHT - 6} className="weight-chart__axis" textAnchor="end">
                {formatDate(sorted[sorted.length - 1].date)}
            </text>
        </svg>
    );
}
