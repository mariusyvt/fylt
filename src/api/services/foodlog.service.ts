import { apiUrl, authHeaders, buildApiError } from "@/api/config/api.config";
import { NewFoodEntry, UpdateFoodEntry } from "@/types/tracking.types";

export const getFoodLog = async (token: string, date: string) => {
    const response = await fetch(apiUrl(`/food-log?date=${date}`), {
        method: "GET",
        headers: authHeaders(token),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const getFoodLogWeek = async (token: string, start: string) => {
    const response = await fetch(apiUrl(`/food-log/week?start=${start}`), {
        method: "GET",
        headers: authHeaders(token),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const getRecentFoods = async (token: string, limit = 10) => {
    const response = await fetch(apiUrl(`/food-log/recent?limit=${limit}`), {
        method: "GET",
        headers: authHeaders(token),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const getMonthlyStats = async (token: string, month: string) => {
    const response = await fetch(apiUrl(`/food-log/stats?month=${month}`), {
        method: "GET",
        headers: authHeaders(token),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const addFoodLogEntry = async (token: string, entry: NewFoodEntry) => {
    const response = await fetch(apiUrl("/food-log"), {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(entry),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const updateFoodLogEntry = async (token: string, id: number, changes: UpdateFoodEntry) => {
    const response = await fetch(apiUrl(`/food-log/${id}`), {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify(changes),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const deleteFoodLogEntry = async (token: string, id: number) => {
    const response = await fetch(apiUrl(`/food-log/${id}`), {
        method: "DELETE",
        headers: authHeaders(token, false),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};
