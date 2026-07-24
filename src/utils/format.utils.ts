import { WeekDay } from "@/types/tracking.types";

export const parsePreparationTime = (timeStr: string): number => {
    const match = timeStr.match(/^(\d+)h(\d+)?$/);
    if (match) {
        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        return hours * 60 + minutes;
    }
    return 0;
}

export const formatPreparationTime = (totalMinutes: number): string => {
    const h = Math.floor(totalMinutes / 60);
    const m = String(totalMinutes % 60).padStart(2, '0');
    return `${h}h${m}`;
}

/**
 * Retourne les 7 jours de la semaine courante (lundi -> dimanche).
 */
export const getWeekDays = (): WeekDay[] => {
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
};
