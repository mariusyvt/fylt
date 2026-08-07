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

export const toISODate = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const getWeekDays = (): WeekDay[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const labels = ["L", "M", "M", "J", "V", "S", "D"];
    return labels.map((label, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return {
            label,
            date: d.getDate(),
            isToday: d.toDateString() === today.toDateString(),
            isFuture: d.getTime() > today.getTime(),
            fullDate: d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
            iso: toISODate(d),
        };
    });
};
